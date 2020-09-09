class PRTriage {
  constructor(github, { owner, repo, logger = console, ...config }) {
    this.github = github;
    this.logger = logger;
    this.config = Object.assign({}, require("./defaults"), config || {}, {
      owner,
      repo,
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
      DRAFT: "labelDraft",
    });
  }

  // see https://developer.github.com/v3/pulls/reviews/#submit-a-pull-request-review
  // see https://developer.github.com/v3/pulls/reviews/#create-a-pull-request-review
  static get GH_REVIEW_STATE() {
    return Object.freeze({
      APPROVED: "APPROVED",
      CHANGES_REQUESTED: "CHANGES_REQUESTED",
    });
  }

  async triage(pullRequest) {
    Object.assign(this.pullRequest, pullRequest);

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
        await this._updateLabel(state);
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
    const requiredNumberOfReviews = await this._getRequiredNumberOfReviews();
    const numRequestedReviewsRemaining = await this._getRequestedNumberOfReviews();

    if (reviews.length === 0) {
      return PRTriage.STATE.UNREVIED;
    } else {
      const changeRequestedReviews = reviews.filter(
        (review) => review.state === PRTriage.GH_REVIEW_STATE.CHANGES_REQUESTED
      );
      const approvedReviews = reviews.filter(
        (review) => review.state === PRTriage.GH_REVIEW_STATE.APPROVED
      );

      if (changeRequestedReviews.length > 0) {
        return PRTriage.STATE.CHANGES_REQUESTED;
      } else if (
        approvedReviews.length < requiredNumberOfReviews ||
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

  async _getUniqueReviews() {
    const reviews = await this._getReviews();
    const sha = this.pullRequest.head.sha;
    const uniqueReviews = reviews
      .filter((review) => review.commit_id === sha)
      .filter(
        (review) =>
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
            submitted_at: review.submitted_at,
          };
        } else {
          const a = new Date(
            reviewObj[review.user.id]["submitted_at"]
          ).getTime();
          const b = new Date(review.submitted_at).getTime();
          if (a < b) {
            reviewObj[review.user.id] = {
              state: review.state,
              submitted_at: review.submitted_at,
            };
          }
        }
        return reviewObj;
      }, {});

    return Object.values(uniqueReviews);
  }

  /**
   * Get the number of required number of reviews according to branch protections
   * @return {Promise<number>} The number of required approving reviews, or 1 if Administration Permission is not granted or Branch Protection is not set up
   * @private
   */
  async _getRequiredNumberOfReviews() {
    const { owner, repo } = this.config;
    const branch = this.pullRequest.base.ref;
    return (
      this.github.repos
        // See: https://developer.github.com/v3/previews/#require-multiple-approving-reviews
        .getBranchProtection({
          owner,
          repo,
          branch,
          mediaType: {
            previews: ["luke-cage"],
          },
        })
        .then((res) => {
          // If the Branch protection rule is configure but the Requrie pull request review before mergning is not set
          // it does not have `required_pull_request_reviews` property
          if (!res.data.hasOwnProperty("required_pull_request_reviews")) {
            throw new Error("Required reviews not configured error");
          }

          return (
            res.data.required_pull_request_reviews
              .required_approving_review_count || 1
          );
        })
        .catch((err) => {
          // Return the minium number of reviews if it's 403 or 403 because Administration Permission is not granted (403) or Branch Protection is not set up(404)
          if (
            err.status === 404 ||
            err.status === 403 ||
            err.message === "Required reviews not configured error"
          ) {
            return 1;
          }
          throw err;
        })
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
    return this.github.pulls
      .listReviewRequests({ owner, repo, pull_number })
      .then((res) => res.data.teams.length + res.data.users.length);
  }

  async _getReviews() {
    const { owner, repo } = this.config;
    // Ignore inconsitent variable name conversation
    // because of https://octokit.github.io/rest.js/v17#pulls-list-reviews
    const pull_number = this.pullRequest.number;
    return this.github.pulls
      .listReviews({ owner, repo, pull_number })
      .then((res) => res.data || []);
  }

  async _ensurePRTriageLabelExists() {
    const labelKeys = Object.keys(this._getFilteredConfigObjByRegex(/label_*/));
    for (let i = 0; i < labelKeys.length; i++) {
      await this._createLabel(labelKeys[i]);
    }
  }

  async _updateLabel(labelKey) {
    const currentLabelKey = await this._getCurrentLabelKey();
    if (currentLabelKey) {
      if (labelKey === PRTriage.STATE.WIP) {
        await this._removeLabel(currentLabelKey);
      } else if (currentLabelKey !== labelKey) {
        await this._removeLabel(currentLabelKey);
        await this._addLabel(labelKey);
      }
    } else {
      if (labelKey !== PRTriage.STATE.WIP) {
        await this._addLabel(labelKey);
      }
    }
  }

  async _createLabel(key) {
    const { owner, repo } = this.config;
    const labelObj = this._getConfigObj(key);

    // Create a label to repository if the label is not created.
    return this.github.issues
      .getLabel({ owner, repo, name: labelObj.name })
      .catch(() => {
        return this.github.issues.createLabel({
          owner,
          repo,
          name: labelObj.name,
          color: labelObj.color,
        });
      });
  }

  async _addLabel(key) {
    const { owner, repo } = this.config;
    const issue_number = this.pullRequest.number;
    const labelObj = this._getConfigObj(key);

    // Add a label to issue if it does not exist.
    return this._getLabel(key).catch(() => {
      return this.github.issues.addLabels({
        owner,
        repo,
        issue_number,
        labels: [labelObj.name],
      });
    });
  }

  async _removeLabel(key) {
    const { owner, repo } = this.config;
    const issue_number = this.pullRequest.number;
    const labelObj = this._getConfigObj(key);

    // Remove the label from a issue if it exists.
    return this._getLabel(key).then(
      (labelObj) => {
        return this.github.issues
          .removeLabel({ owner, repo, issue_number, name: labelObj.name })
          .catch((err) => {
            // Ignore if it's a 404 because then the label was already removed
            if (err.status !== 404) {
              throw err;
            }
          });
      },
      () => {}
    ); // Do nothing for error handling.
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
      .map((label) => {
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
      .filter((key) => key !== "undefined")[0];
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
