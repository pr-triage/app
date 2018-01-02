class LabelingDroid {
  constructor (github, config = {}) {
    this.github = github
    this.config = Object.assign({}, require('./defaults'), config || {})
    this.pullRequest = {}
  }

  async init () {
    for (const labelObj in this._getFilteredConfigWithRegex(/label_*/)) {
      await this._ensureLabelExists(labelObj)
    }
    this.pullRequest = await this._getPullRequest()
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

  static get STATUS () {
    return {
      WIP: 'label_wip',
      UNREVIED: 'label_unreviewed',
      APPROVED: 'label_approved',
      CHANGE_RQUESTED: 'label_change_requested'
    }
  }

  async getStatus () {
    if (this.pullRequest.title.match(this._getConfigValue('wip_regex'))) {
      return LabelingDroid.STATUS.WIP
    }

    const latestReviews = await this._getLatestReviews()
    if (this._isEmptyObj(latestReviews)) {
      return LabelingDroid.STATUS.UNREVIED
    } else {
      const changeRequestedReviews = latestReviews.filter((latestReview) => latestReview['state'] === 'CHANGE_REQUESTED')
      if (changeRequestedReviews.length === 0) {
        return LabelingDroid.STATUS.APPROVED
      } else {
        return LabelingDroid.STATUS.CHANGE_RQUESTED
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

  async _getPullRequest () {
    return (await this.github.issues.get(this.config)).data
  }

  async _getLabel (key) {
    return new Promise((resolve, reject) => {
      for (const label of this.pullRequest.labels) {
        if (label.name === this._getConfigValue(key).name) {
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

  async _getLatestReviews () {
    const { owner, repo, number } = this.config
    const reviews = (await this.github.pullRequests.getReviews({ owner, repo, number })).data
    return this._uniqueReviews(reviews)
  }

  _uniqueReviews (reviews) {
    const uniqueReviews = []
    const { sha } = this.config

    reviews.filter((review) => review.commit_id === sha).map((review) => {
      const userId = review.user.id
      if (uniqueReviews[userId] === null || uniqueReviews[userId] === undefined) {
        uniqueReviews[userId] = { state: review.state, submitted_at: review.submitted_at }
      } else {
        const a = new Date(uniqueReviews[userId]['submitted_at']).getTime()
        const b = new Date(review.submitted_at).getTime()

        if (a < b) {
          uniqueReviews[userId] = { state: review.state, submitted_at: review.submitted_at }
        }
      }
    })

    return uniqueReviews
  }

  _getConfigValue (key) {
    return this.config[key]
  }

  _getFilteredConfigWithRegex (regex) {
    let filteredConfig = {}
    for (const key in this.config) {
      if (this.config.hasOwnProperty(key) && regex.test(key)) {
        filteredConfig[key] = this._getConfigValue(key)
      }
    }
    return filteredConfig
  }

  _isEmptyObj (obj) {
    return !!(Object.keys(obj).length === 0 && obj.constructor === Object)
  }
}

module.exports = LabelingDroid
