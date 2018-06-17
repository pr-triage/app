const debug = require("debug")("probot:pr-triage");
const PRTriage = require("./lib/pr-triage");

function probotPlugin(robot) {
  debug("ready to receive GitHub webhooks");
  const events = [
    "pull_request.opened",
    "pull_request.edited",
    "pull_request.synchronize",
    "pull_request.reopened",
    "pull_request_review.submitted"
  ];

  robot.on(events, triage);
}

async function triage(context) {
  // skip if the actor on the event was a bot.
  if (context.isBot) {
    return false;
  }

  const prTriage = forRepository(context);
  prTriage.triage();
}

function forRepository(context) {
  // Extract pull request object depends on context
  const pullRequest =
    context.payload.pull_request || context.payload.review.pull_request;
  const config = Object.assign(
    {},
    context.issue({ sha: pullRequest.head.sha })
  );

  return new PRTriage(context.github, config);
}

module.exports = probotPlugin;
