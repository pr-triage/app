const debug = require("debug")("probot:pr-triage");
const Raven = require("raven");
const PRTriage = require("./lib/pr-triage");

Raven.config(
  process.env.NODE_ENV === "production" &&
    "https://dce36edab6334112b02122e07b2bc549@sentry.io/1222067"
).install();

function probotPlugin(robot) {
  const events = [
    "pull_request.opened",
    "pull_request.closed",
    "pull_request.edited",
    "pull_request.synchronize",
    "pull_request.reopened",
    "pull_request.ready_for_review",
    "pull_request_review.submitted",
    "pull_request_review.dismissed"
  ];

  robot.on(events, triage);
}

async function triage(context) {
  const prTriage = forRepository(context);
  const pullRequest = getPullRequest(context);

  Raven.context(() => {
    Raven.setContext({
      extra: {
        owner: context.repo()["owner"],
        repo: context.repo()["repo"],
        number: pullRequest.number
      }
    });
    prTriage.triage(pullRequest);
  });
}

function forRepository(context) {
  const config = Object.assign({}, context.repo({ logger: debug }));
  return new PRTriage(context.github, config);
}

function getPullRequest(context) {
  return context.payload.pull_request || context.payload.review.pull_request;
}

module.exports = probotPlugin;
