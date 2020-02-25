class PRTriage {
  constructor(github, { owner, repo, logger = console, ...config }) {
    this.github = github;
    this.logger = logger;
    this.config = Object.assign({}, require("./defaults"), config || {}, {
      owner,
      repo
    });
    this.pullRequest = {};
  }

  static get STATE() {
    return Object.freeze({
      WIP: "labelWip",
      UNREVIED: "labelUnreviewed",
      APPROVED: "labelApproved",
      CHANGES_REQUESTED: "labelChangesRequested",
      PARTIALLY_APPROVED: "labelPartiallyApproved",
      MERGED: "labelMerged",
      DRAFT: "labelDraft"
    });
  }

  // see https://developer.github.com/v3/pulls/reviews/#submit-a-pull-request-review
  // see https://developer.github.com/v3/pulls/reviews/#create-a-pull-request-review
  static get GH_REVIEW_STATE() {
    return Object.freeze({
      APPROVED: "APPROVED",
      CHANGES_REQUESTED: "CHANGES_REQUESTED"
    });
  }

  async triage(pullRequest) {
    Object.assign(this.pullRequest, pullRequest);
    const { owner, repo } = this.config;
    const number = this.pullRequest.number;

    await this._ensurePRTriageLabelExists();
    const state = await this._getState();

    switch (state) {
      case PRTriage.STATE.WIP:
      case PRTriage.STATE.UNREVIED:
      case PRTriage.STATE.CHANGES_REQUESTED:
      case PRTriage.STATE.PARTIALLY_APPROVED:
      case PRTriage.STATE.APPROVED:
      case PRTriage.STATE.DRAFT:
      case PRTriage.STATE.MERGED:
        this._updateLabel(state);
        this.logger(
          "%s/%s#%s is labeld as %s",
          owner,
          repo,
          number,
          Object.keys(PRTriage.STATE).find(k => {
            return PRTriage.STATE[k] === state;
          })
        );
        break;
      default:
        throw new Error("Undefined state");
    }
  }

  async _getState() {
    if (this.pullRequest.draft) {
      return PRTriage.STATE.DRAFT;
    } else if (this.pullRequest.title.match(this._getConfigObj("wipRegex"))) {
      return PRTriage.STATE.WIP;
    } else if (this.pullRequest.state === "closed" && this.pullRequest.merged) {
      return PRTriage.STATE.MERGED;
    }

    const reviews = await this._getUniqueReviews();
    const numNeededReviews = await this._getRequiredNumberOfReviews();
    const numRequestedReviewsRemaining = await this._getRequestedNumberOfReviews();

    if (reviews.length === 0) {
      return PRTriage.STATE.UNREVIED;
    } else {
      const changeRequestedReviews = reviews.filter(
        review => review.state === PRTriage.GH_REVIEW_STATE.CHANGES_REQUESTED
      );
      const approvedReviews = reviews.filter(
        review => review.state === PRTriage.GH_REVIEW_STATE.APPROVED
      );

      if (changeRequestedReviews.length > 0) {
        return PRTriage.STATE.CHANGES_REQUESTED;
      } else if (
        approvedReviews.length < numNeededReviews ||
        numRequestedReviewsRemaining > 0
      ) {
        // Mark if partially approved if:
        // 1) Branch protections require more approvals
        //  - or -
        // 2) not everyone requested has approved (requested remaining > 0)
        return PRTriage.STATE.PARTIALLY_APPROVED;
      } else if (reviews.length === approvedReviews.length) {
        return PRTriage.STATE.APPROVED;
      }
    }
  }

  /**
   * Get the number of required number of reviews according to branch protections
   * @return {Promise<number>} The number of required approving reviews, or 1 if branch protections are not set up.
   * @private
   */
  async _getRequiredNumberOfReviews() {
    const { owner, repo } = this.config;
    const branch = this.pullRequest.base.ref;
    const branchProtections = await this.github.repos.getBranchProtection({
      owner,
      repo,
      branch
    });

    const requiredReviews =
      branchProtections.data.required_pull_request_reviews;
    return (
      (requiredReviews && requiredReviews.required_approving_review_count) || 1
    );
  }

  /**
   * Get the number of users and teams that have been requested to review the PR
   * @return {Promise<number>}
   * @private
   */
  async _getRequestedNumberOfReviews() {
    const { owner, repo } = this.config;
    const pull_number = this.pullRequest.number;
    const requestedReviewsObj = await this.github.pulls.listReviewRequests({
      owner,
      repo,
      pull_number
    });

    return (
      requestedReviewsObj.data.teams.length +
      requestedReviewsObj.data.users.length
    );
  }

  async _getUniqueReviews() {
    const { owner, repo } = this.config;
    const pull_number = this.pullRequest.number;
    const sha = this.pullRequest.head.sha;

    const reviews =
      (await this.github.pulls.listReviews({ owner, repo, pull_number }))
        .data || [];

    const uniqueReviews = reviews
      .filter(review => review.commit_id === sha)
      .filter(
        review =>
          review.state === PRTriage.GH_REVIEW_STATE.APPROVED ||
          review.state === PRTriage.GH_REVIEW_STATE.CHANGES_REQUESTED
      )
      .reduce((reviewObj, review) => {
        if (
          reviewObj[review.user.id] === null ||
          reviewObj[review.user.id] === undefined
        ) {
          reviewObj[review.user.id] = {
            state: review.state,
            submitted_at: review.submitted_at
          };
        } else {
          const a = new Date(
            reviewObj[review.user.id]["submitted_at"]
          ).getTime();
          const b = new Date(review.submitted_at).getTime();
          if (a < b) {
            reviewObj[review.user.id] = {
              state: review.state,
              submitted_at: review.submitted_at
            };
          }
        }
        return reviewObj;
      }, {});

    return Object.values(uniqueReviews);
  }

  async _ensurePRTriageLabelExists() {
    for (const labelObj in this._getFilteredConfigObjByRegex(/label_*/)) {
      await this._createLabel(labelObj);
    }
  }

  async _createLabel(key) {
    const { owner, repo } = this.config;
    const labelObj = this._getConfigObj(key);

    return this.github.issues
      .getLabel({ owner, repo, name: labelObj.name })
      .catch(() => {
        return this.github.issues.createLabel({
          owner,
          repo,
          name: labelObj.name,
          color: labelObj.color
        });
      });
  }

  async _addLabel(key) {
    const { owner, repo } = this.config;
    const number = this.pullRequest.number;
    const labelObj = this._getConfigObj(key);

    // Check if a label does not exist. If it does, it addes the label.
    return this._getLabel(key).catch(() => {
      return this.github.issues.addLabels({
        owner,
        repo,
        number,
        labels: [labelObj.name]
      });
    });
  }

  async _removeLabel(key) {
    const { owner, repo } = this.config;
    const issue_number = this.pullRequest.number;
    const labelObj = this._getConfigObj(key);

    // Check if a label exists. If it does, it removes the label.
    return this._getLabel(key).then(
      labelObj => {
        return this.github.issues
          .removeLabel({ owner, repo, issue_number, name: labelObj.name })
          .catch(err => {
            // Ignore if it's a 404 because then the label was already removed
            if (err.code !== 404) {
              throw err;
            }
          });
      },
      () => {}
    ); // Do nothing for error handling.
  }

  async _updateLabel(labelKey) {
    const currentLabelKey = await this._getCurrentLabelKey();
    if (currentLabelKey) {
      if (labelKey === PRTriage.STATE.WIP) {
        this._removeLabel(currentLabelKey);
      } else if (currentLabelKey !== labelKey) {
        this._removeLabel(currentLabelKey);
        this._addLabel(labelKey);
      }
    } else {
      if (labelKey !== PRTriage.STATE.WIP) {
        this._addLabel(labelKey);
      }
    }
  }

  _getLabel(key) {
    return new Promise((resolve, reject) => {
      for (const label of this.pullRequest.labels) {
        const lableObj = this._getConfigObj(key);
        if (lableObj && lableObj.name && label.name === lableObj.name) {
          resolve(lableObj);
        }
      }
      reject(new Error("Not found"));
    });
  }

  _getCurrentLabelKey() {
    return this.pullRequest.labels
      .map(label => {
        const filteredConfig = this._getFilteredConfigObjByRegex(/label_*/);
        for (const labelKey in filteredConfig) {
          const configValue = filteredConfig[labelKey];
          if (
            configValue &&
            configValue.name &&
            label.name === configValue.name
          ) {
            return labelKey;
          }
        }
      })
      .filter(key => key !== "undefined")[0];
  }

  _getFilteredConfigObjByRegex(regex) {
    return Object.keys(this.config).reduce((result, key) => {
      if (regex.test(key)) {
        result[key] = this._getConfigObj(key);
      }
      return result;
    }, {});
  }

  _getConfigObj(key) {
    return this.config[key];
  }
}

module.exports = PRTriage;
