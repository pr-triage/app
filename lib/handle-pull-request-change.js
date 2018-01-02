const getDebug = require('debug')
const LabelingDroid = require('./labeling-droid')

async function handlePullRequestChange (context) {
  const debug = getDebug(`probot:labeling-droid:${context.payload.repository.full_name.toLowerCase()}/pull/${context.issue().number}`)
  const labelingDroid = forRepository(context)

  // TODO: Consider more smart way
  // It should execute in constructor?
  await labelingDroid.init()

  const labelType = await labelingDroid.getCurrentLabelType()
  const status = await labelingDroid.getStatus()

  switch (status) {
    case LabelingDroid.STATUS.WIP:
      debug(`status is WIP`)
      if (labelType) {
        labelingDroid.removeLabel(labelType)
      }
      break
    case LabelingDroid.STATUS.UNREVIED:
      debug(`status is UNREVIED`)
      changeLabel(labelingDroid, LabelingDroid.STATUS.UNREVIED, labelType)
      break
    case LabelingDroid.STATUS.CHANGE_RQUESTED:
      debug(`status is CHANGE_RQUESTED`)
      changeLabel(labelingDroid, LabelingDroid.STATUS.CHANGE_RQUESTED, labelType)
      break
    case LabelingDroid.STATUS.APPROVED:
      debug(`status is APPROVED`)
      changeLabel(labelingDroid, LabelingDroid.STATUS.APPROVED, labelType)
      break
    default:
      throw new Error('undefined status')
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
