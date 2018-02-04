const getDebug = require('debug')
const LabelingDroid = require('./labeling-droid')

async function handlePullRequestChange (context) {
  const debug = getDebug(`probot:sidekick:${context.payload.repository.full_name.toLowerCase()}/pull/${context.issue().number}`)
  const labelingDroid = forRepository(context)
  await labelingDroid.init()

  const labelType = await labelingDroid.getCurrentLabelType()
  const state = await labelingDroid.getState()

  switch (state) {
    case LabelingDroid.STATE.WIP:
      debug(`status is WIP`)
      if (labelType) {
        labelingDroid.removeLabel(labelType)
      }
      break
    case LabelingDroid.STATE.UNREVIED:
      debug(`status is UNREVIED`)
      changeLabel(labelingDroid, LabelingDroid.STATE.UNREVIED, labelType)
      break
    case LabelingDroid.STATE.CHANGES_REQUESTED:
      debug(`status is CHANGE_RQUESTED`)
      changeLabel(labelingDroid, LabelingDroid.STATE.CHANGES_REQUESTED, labelType)
      break
    case LabelingDroid.STATE.APPROVED:
      debug(`status is APPROVED`)
      changeLabel(labelingDroid, LabelingDroid.STATE.APPROVED, labelType)
      break
    default:
      throw new Error('undefined state')
  }
}

function changeLabel (labelingDroid, labelType, existingLabelType = null) {
  if (existingLabelType) {
    if (existingLabelType !== labelType) {
      labelingDroid.removeLabel(existingLabelType)
      labelingDroid.addLabel(labelType)
    }
  } else {
    labelingDroid.addLabel(labelType)
  }
}

function forRepository (context) {
  const pullRequest = context.payload.pull_request || context.payload.review.pull_request
  const config = Object.assign({}, context.issue({ sha: pullRequest.head.sha }))
  return new LabelingDroid(context.github, config)
}

module.exports = handlePullRequestChange
