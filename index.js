const debug = require('debug')('probot:labeling-droid')
const handlePullRequestChange = require('./lib/handle-pull-request-change')

function probotPlugin (robot) {
  debug('ready to receive GitHub webhooks')
  const events = [
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.synchronize',
    'pull_request.reopened',
    'review_pull_request.submitted'
  ]

  robot.on(events, function (context) {
    // skip if the actor on the event was a bot.
    if (!context.isBot) {
      handlePullRequestChange(context)
    }
  })
}

module.exports = probotPlugin
