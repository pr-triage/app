# Looking for contributors!!

[prtriage]: https://github.com/apps/pr-triage

[dep badge]:   https://api.dependabot.com/badges/status?host=github&repo=pr-triage/app
[dep url]:     https://dependabot.com

[coverage badge]: https://codecov.io/gh/pr-triage/app/branch/master/graph/badge.svg
[coverage url]:   https://codecov.io/gh/pr-triage/app

[vulnerabilities badge]: https://snyk.io/test/github/pr-triage/app/badge.svg?targetFile=package.json
[vulnerabilities url]:   https://snyk.io/test/github/pr-triage/app?targetFile=package.json

[license management badge]: https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpr-triage%2Fapp.svg?type=shield
[license management url]:   https://app.fossa.io/projects/git%2Bgithub.com%2Fpr-triage%2Fapp?ref=badge_shield

# [PRTriage][prtriage] &middot; [![dep status Status][dep badge]][dep url] [![vulnerabilities status][vulnerabilities badge]][vulnerabilities url] [![licence management status][license management badge]][license management url]

> GitHub App built with [Probot](https://github.com/probot/probot) that add an appropriate label depend on the PR's status.


## Motivation

I spent the time to know Pull requests status during team development. As a team bigger, time becomes more increased. 
At first it was used internally but I noticed most of people have same problem so I published it as Open Source :sparkles:.


## Installation

1. Go to [PRTriage App top page](https://probot.github.io/apps/pr-triage/)
1. Click **"+ Add to GitHub"** button
1. Choose a repository
1. That's it :sparkles:

[Learn how to install it for GitHub Enterprise](https://github.com/pr-triage/app/wiki#installation-for-github-enterprise).


## How it works

Only watching the most recent commit :eyes::

<p align="center">
<img src="https://raw.githubusercontent.com/pr-triage/app/master/public/assets/screenshots/workflow.png" width="100%" height="auto" />
</p>

- Do nothing when the PR's title starts from `WIP`, `[WIP]` or `WIP:`.
- Add the `PR: draft` lable when the draft PR is created.
- Add the `PR: unreviewed` label when the PR does not have any reviews.
- Add the `PR: reviewed-changes-requested` label when the PR has reviewed and got `Change request` event.
- Add the `PR: partially-approved` label when PR has reviewd and got `Approve` from one of the reviewers.
- Add the `PR: review-approved` label when the PR has reviewed and got `Approve` from everyone.
- Add the `PR: merged` label when the PR has merged.


## Trusted by

Example users include the following GitHub organizations:

[<img align="left" src="https://avatars3.githubusercontent.com/u/6128107?s=60&v=4" alt="vuejs" title="vuejs"  space="5"/>](https://github.com/vuejs)

[<img align="left" src="https://avatars2.githubusercontent.com/u/13521919?s=60&v=4" alt="The Practical Dev" title="The Practical Dev"  space="5"/>](https://github.com/thepracticaldev)

[<img align="left" src="https://avatars2.githubusercontent.com/u/11468134?s=60&v=4" alt="Linio" title="Linio"  space="5"/>](https://github.com/LinioIT)

[<img align="left" src="https://avatars3.githubusercontent.com/u/10746780?s=60&v=4" alt="Redash" title="Redash"  space="5"/>](https://github.com/getredash)

[<img align="left" src="https://avatars1.githubusercontent.com/u/12101536?s=60&v=4" alt="And design" title="Ant design"  space="5"/>](https://github.com/ant-design)

[<img align="left" src="https://avatars3.githubusercontent.com/u/686511?s=60&v=4" alt="Wix" title="Wix"  space="5"/>](https://github.com/wix)

[<img align="left" src="https://avatars3.githubusercontent.com/u/21287010?s=60&v=4" alt="Autify" title="Autify"  space="5"/>](https://github.com/autifyhq)

<br/><br/>


## Contributing

### [Code of Conduct](CODE_OF_CONDUCT.md)

It has adopted a Code of Conduct that we expect project participants to adhere to. <br/>
Please read [the full text](CODE_OF_CONDUCT.md) so that you can understand what actions will and will not be tolerated.

### [Contributing Guide](CONTRIBUTING.md)

Read our [contributing guide](CONTRIBUTING.md) to learn about our development process, how to propose bugfixes<br/> 
and improvements, and how to build and test your changes to PRTriage.


## License

PRTriage © [Sam Yamashita](https://twitter.com/sota0805). Released under the [Apache 2.0](LICENSE)<br/>
Authored and maintained by [Sam Yamashita](https://twitter.com/sota0805) with help from [contributors](https://github.com/pr-triage/app/contributors).

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fpr-triage%2Fapp.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fpr-triage%2Fapp?ref=badge_large)

[Privacy Policy](https://github.com/pr-triage/policies/blob/master/PRIVACY.md)・[Security Policy](https://github.com/pr-triage/policies/blob/master/SECURITY.md)
