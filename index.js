const debug = require('debug')('probot:pr-label')
const handlePullRequestChange = require('./lib/handle-pull-request-change')

function probotPlugin (robot) {
  debug('ready to receive GitHub webhooks')
  robot.on([
    'pull_request.opened',
    'pull_request.edited',
    'pull_request.synchronize',
    'review_pull_request.submitted'
  ], handlePullRequestChange.bind(null, robot))
}

module.exports = probotPlugin
