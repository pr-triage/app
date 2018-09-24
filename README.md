[build badge]: https://travis-ci.com/pr-triage/app.svg?branch=master
[build url]:   https://travis-ci.com/pr-triage/app

[dep badge]:   https://api.dependabot.com/badges/status?host=github&repo=pr-triage/app
[dep url]:     https://dependabot.com

[coverage badge]: https://codecov.io/gh/pr-triage/app/branch/master/graph/badge.svg
[coverage url]:   https://codecov.io/gh/pr-triage/app

[vulnerabilities badge]: https://snyk.io/test/github/pr-triage/app/badge.svg?targetFile=package.json
[vulnerabilities url]:   https://snyk.io/test/github/pr-triage/app?targetFile=package.json

# PRTriage [![build status][build badge]][build url] [![dep status Status][dep badge]][dep url] [![vulnerabilities status][vulnerabilities badge]][vulnerabilities url]

> GitHub App built with [Probot](https://github.com/probot/probot) that add an appropriate label depend on the PR's status.


## Motivation

Firstly, I started to create PRTriage to solve my own pain. As an engineer, I spent my time to ask colleagues Pull Requests status such as `WIP (work in progress)`・`UNREVIEWED`・`CHANGES_REQUESTED`・`APPROVED`. Most of the developers use [GitHub](https://github.com) and follow [GitHub Flow](https://guides.github.com/introduction/flow/)/[Git Flow](https://datasift.github.io/gitflow/IntroducingGitFlow.html). Most of them say that the time it takes to know pull request status is getting increasing as the team is large so I published it as Open Source :sparkles:.

## Installation

Please follow the below steps to install quickly :rocket::

1. Go to [PRTriage App top page](https://probot.github.io/apps/pr-triage/)
1. Click **"+ Add to GitHub"** button
1. Choose a repository
1. That's it :sparkles:

## How it works

Only watching the most recent commit :eyes::

<p align="center">
<img src="https://raw.githubusercontent.com/pr-triage/app/master/public/assets/screenshots/workflow.png" width="100%" height="auto" />
</p>

- Do nothing when the PR's title starts from `WIP`, `[WIP]` or `WIP:`.
- Add the `PR: unreviewed` label when the PR does not have any reviews.
- Add the `PR: reviewed-changes-requested` label when the PR has reviewed and got `Change request` event.
- Add the `PR: review-approved` label when the PR has reviewed and got `Approve` event.


## Installation for GitHub Enterprise

Please follow the below steps to install for GitHub Enterprise :rocket::

1. Go to GitHub Enterprise URL. E.g. `fake.github-enterprise.com`
1. Go to `fake.github-enterprise.com/settings/apps/new`
1. Create a new app which has Permissions and Subscribe to events below:
    - Permissions
        - Pull request
            - Access: Read & Write
    - Subscribe to events
        - Pull request
        - Pull request review
1. Deploy the app to Glitch, Heroku or Now.
    - [Read more about how to deploy app](https://probot.github.io/docs/deployment/)


## Contributing

Please read [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.


## License

PRTriage © Sam Yamashita. Released under the [Apache 2.0](LICENSE)<br/>
Authored and maintained by Sam Yamashita with help from [contributors](https://github.com/pr-triage/app/contributors).

[Privacy Policy](https://github.com/pr-triage/policies/blob/master/PRIVACY.md)・[Security Policy](https://github.com/pr-triage/policies/blob/master/SECURITY.md)
