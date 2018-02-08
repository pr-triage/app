[npm badge]: https://badge.fury.io/js/sidekick-bot.svg
[npm url]:   https://badge.fury.io/js/sidekick-bot
[build badge]: https://travis-ci.org/sotayamashita/sidekick.svg?branch=master
[build url]:   https://travis-ci.org/sotayamashita/sidekick
[codecov badge]: https://codecov.io/gh/sotayamashita/sidekick/branch/master/graph/badge.svg
[codecov url]:   https://codecov.io/gh/sotayamashita/sidekick
[greenkeeper badge]: https://badges.greenkeeper.io/sotayamashita/sidekick.svg
[greenkeeper url]:   https://greenkeeper.io/

# sidekick [![npm][npm badge]][npm url] [![build status][build badge]][build url] [![codecov][codecov badge]][codecov url] [![greenkeeper status][greenkeeper badge]][greenkeeper url]

<p>
  <a href="https://www.buymeacoffee.com/pM9aX60">
    <img src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-1.svg" height="41px" />
  </a>
</p>

> GitHub App built with [Probot](https://github.com/probot/probot) that support pull request workflow

## Features

<p>
  <img src="https://user-images.githubusercontent.com/1587053/35917561-f4928e02-0c51-11e8-95d3-81b4f44ed6d2.png" width="100%">
</p>

- Do nohting if your title of PR starts from `WIP`, `[WIP]` or `WIP:`.
- Add a `PR: unreviewed` label if your PR does not have any reviews.
- Add a `PR: reviewed-changes-requested` label if you PR have reviewed and got **Change request**
- Add a `PR: review-approved` label if you PR have reviewed and got **Approve**

## How to install it into your repository

_**Heads-up!** It built with [GitHub App](https://developer.github.com/apps/building-github-apps/) and it does NOT have any permission to ready your code :see_no_evil: Please do not worry about it. If you have any question please ask via [creating a issue](https://github.com/sotayamashita/sidekick/issues/new?labels=question)._

1. Go to [Sidekick Page](https://github.com/apps/sidekick) and click **Install**
2. Please choose a repository you want to use it :smile:
