class LabelingDroid {
  constructor (github, config = {}) {
    this.github = github
    this.config = Object.assign({}, require('./defaults'), config || {})
    this.pullRequest = {}
  }

  /**
   * Map GitHub review state to config keys
   * https://developer.github.com/v3/pulls/reviews/
   */
  static get STATE () {
    return Object.freeze({
      WIP: 'labelWip',
      UNREVIED: 'labelUnreviewed',
      APPROVED: 'labelApproved',
      CHANGES_REQUESTED: 'labelChangesRequested'
    })
  }

  // TODO: wanna execute it in constructor but I can't do cuz of async/await
  async init () {
    for (const labelObj in this._getFilteredConfigWithRegex(/label_*/)) {
      await this._ensureLabelExists(labelObj)
    }
    this.pullRequest = (await this.github.issues.get(this.config)).data
  }

  getCurrentLabelType () {
    const labelArry = this.pullRequest.labels.map((label) => {
      const filteredConfig = this._getFilteredConfigWithRegex(/label_*/)
      for (const labelConfig in filteredConfig) {
        if (label.name === filteredConfig[labelConfig].name) {
          return labelConfig
        }
      }
    })
    return labelArry[0] || ''
  }

  async getState () {
    if (this.pullRequest.title.match(this._getConfigValue('wipRegex'))) {
      return LabelingDroid.STATE.WIP
    }

    const reviews = await this._getFilteredReviews()
    if (reviews.length === 0) {
      return LabelingDroid.STATE.UNREVIED
    } else {
      if (reviews.filter((review) => review.state === 'CHANGES_REQUESTED').length > 0) {
        return LabelingDroid.STATE.CHANGES_REQUESTED
      } else if (reviews.length === reviews.filter((review) => review.state === 'APPROVED').length) {
        return LabelingDroid.STATE.APPROVED
      }
    }
  }

  async addLabel (key) {
    const { owner, repo, number } = this.config
    const labelObj = this._getConfigValue(key)

    // Confirm whether a label exists or not. If it does not, it would add the label.
    return this._getLabel(key).catch(() => {
      return this.github.issues.addLabels({owner, repo, number, labels: [labelObj.name]})
    })
  }

  async removeLabel (key) {
    const { owner, repo, number } = this.config

    // Confirm whether a label exists or not. If it does, it would remove the label
    return this._getLabel(key).then((labelObj) => {
      return this.github.issues.removeLabel({owner, repo, number, name: labelObj.name}).catch((err) => {
        // Ignore if it's a 404 because then the label was already removed
        // See: https://github.com/probot/stale/blob/master/lib/stale.js#L138
        if (err.code !== 404) {
          throw err
        }
      })
    })
  }

  async _getLabel (key) {
    return new Promise((resolve, reject) => {
      for (const label of this.pullRequest.labels) {
        if (this._getConfigValue(key) && label.name === this._getConfigValue(key).name) {
          resolve(label)
        }
      }
      reject(new Error('not found'))
    })
  }

  async _ensureLabelExists (key) {
    const { owner, repo } = this.config
    const labelObj = this._getConfigValue(key)
    return this.github.issues.getLabel({owner, repo, name: labelObj.name}).catch(() => {
      return this.github.issues.createLabel({owner, repo, name: labelObj.name, color: labelObj.color})
    })
  }

  async _getFilteredReviews () {
    const { owner, repo, number } = this.config
    const reviews = (await this.github.pullRequests.getReviews({ owner, repo, number })).data
    return this._getUniqueReviews(reviews)
  }

  _getUniqueReviews (reviews) {
    const uniqueReviewByUserId = reviews
      .filter((review) => review.commit_id === this._getConfigValue('sha'))
      .filter((review) => review.state !== 'COMMENTED')
      .reduce((reviewObj, review) => {
        if (reviewObj[review.user.id] === null || reviewObj[review.user.id] === undefined) {
          reviewObj[review.user.id] = { state: review.state, submitted_at: review.submitted_at }
        } else {
          const a = new Date(reviewObj[review.user.id]['submitted_at']).getTime()
          const b = new Date(review.submitted_at).getTime()
          if (a < b) {
            reviewObj[review.user.id] = { state: review.state, submitted_at: review.submitted_at }
          }
        }
        return reviewObj
      }, {})

    return Object.keys(uniqueReviewByUserId).reduce((reviewsArry, userId) => {
      reviewsArry[reviewsArry.length] = { user_id: +userId, state: uniqueReviewByUserId[userId].state }
      return reviewsArry
    }, [])
  }

  _getConfigValue (key) {
    return this.config[key]
  }

  _getFilteredConfigWithRegex (regex) {
    return Object.keys(this.config)
      .reduce((result, key) => {
        if (regex.test(key)) {
          result[key] = this._getConfigValue(key)
        }
        return result
      }, {})
  }

  _isEmptyObj (obj) {
    return !!(Object.keys(obj).length === 0 && obj.constructor === Object)
  }
}

module.exports = LabelingDroid
