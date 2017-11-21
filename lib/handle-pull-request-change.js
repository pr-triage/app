const getDebug = require('debug')

async function handlePullRequestChange (robot, context) {
  const pullRequest = context.payload.pull_request || context.payload.review.pull_request
  const number = pullRequest.number
  const title = pullRequest.title
  const owner = context.payload.repository.owner.login
  const name = context.payload.repository.name
  const head = pullRequest.head.sha
  const params = {
    owner: owner,
    repo: name,
    number: number
  }

  const debug = getDebug(`probot:pr-label:${context.payload.repository.full_name.toLowerCase()}`)

  // Do nothing if title includes wip
  // such as GitLab's "Work In Progress" Merge Requests
  if (title.match(/^wip(?=:|)/i)) {
    debug(`ignoring: "${title}" matches /^wip(?=:|)/i`)
    updateLabelIfNeeded(context, params, '')
    return false
  }

  // TODO: Refactor the code befause it is too complicated
  // Eliminate duplication by user, latest commit hash and submitted_at
  const reviews = await context.github.pullRequests.getReviews(params)
  let filteredReviewRequestByUserId = {}
  for (let i = 0; i < reviews.data.length; i += 1) {
    const review = reviews.data[i]

    // skip when review is not for latest commit
    if (review.commit_id !== head) {
      continue
    }

    if (!filteredReviewRequestByUserId[review.user.id]) {
      filteredReviewRequestByUserId[review.user.id] = { state: review.state, submitted_at: review.submitted_at }
    } else {
      const base = new Date(filteredReviewRequestByUserId[review.user.id]['submitted_at']).getTime()
      const head = new Date(review.submitted_at).getTime()

      if (base < head) {
        filteredReviewRequestByUserId[review.user.id] = { state: review.state, submitted_at: review.submitted_at }
      }
    }
  }
  debug(`info: #{JSON.stringify(filteredReviewRequestByUserId, 0, 2)}`)

  if (Object.keys(filteredReviewRequestByUserId).length === 0) {
    // Add PR:unreviewed
    updateLabelIfNeeded(context, params, 'PR:unreviewed')
    return false
  }

  let count = 0
  for (let i = 0; i < Object.keys(filteredReviewRequestByUserId).length; i += 1) {
    const state = Object.values(filteredReviewRequestByUserId)[i].state
    switch (state) {
      case 'APPROVED':
        count += 1
        break
      case 'CHANGES_REQUESTED':
        count -= 1
        break
    }
  }

  if (count > 0) {
    // Add 'PR:review-approved'
    updateLabelIfNeeded(context, params, 'PR:review-approved')
  } else if (count < 0) {
    // Add 'PR:changes-requested'
    updateLabelIfNeeded(context, params, 'PR:changes-requested')
  }
}

async function updateLabelIfNeeded (context, params, label) {
  const response = await context.github.issues.get(params)
  let shouldUpdateLabel = true
  for (let i = 0; i < response.data.labels.length; i += 1) {
    if (response.data.labels[i] === label) {
      shouldUpdateLabel = false
      break
    } else if (response.data.labels[i].name.match(/PR:/)) {
      removeLabel(context, params, response.data.labels[i].name)
    }
  }

  if (shouldUpdateLabel) {
    addLabel(context, params, label)
  }
}

async function removeLabel (context, params, label) {
  context.github.issues.removeLabel(Object.assign({}, params, {name: label}))
}

async function addLabel (context, params, label) {
  context.github.issues.addLabels(Object.assign({}, params, {labels: [label]}))
}

module.exports = handlePullRequestChange
