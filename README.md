[npm badge]: https://badge.fury.io/js/labeling-droid.svg
[npm url]:   https://badge.fury.io/js/labeling-droid
[build badge]: https://travis-ci.org/sotayamashita/labeling-droid.svg?branch=master
[build url]:   https://travis-ci.org/sotayamashita/labeling-droid
[greenkeeper badge]: https://badges.greenkeeper.io/sotayamashita/labeling-droid.svg
[greenkeeper url]:   https://greenkeeper.io/

# labeling-droid [![npm][npm badge]][npm url] [![build status][build badge]][build url] [![greenkeeper status][greenkeeper badge]][greenkeeper url]

<p>
  <a href="https://www.patreon.com/bePatron?u=6995574" target="_blank">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" height="40px" />
  </a>
</p>

> GitHub App built with [Probot](https://github.com/probot/probot) that add a label automatically to know PR status at first glance.

In team development, pull request are getting increasing. In this situation, it is very hard to know **Is it work in progress?**, **Is it unreviewed?**, **Is it requested to change** or **Is it ready to ship?** at first glance. That way I created it. It will help you know PR status at first sight by adding label. It is deployed with [glitch](https://glitch.com) and its url is [https://labeling-droid.glitch.me/probot](https://labeling-droid.glitch.me/probot).

## How to activate the droid on your repository

1. Go to [Labeling Droid GitHub App Page](https://github.com/apps/labeling-droid)
1. Choose user or organization to install.
1. Input your repository name.

## How does it works on your repository

It will add each label to know each question below:

- _"Is it work in progress?"_ - `N/A`
- _"Is it unreviewed?"_ - `PR: unreviewed`
- _"Is it requested to change?"_ - `PR: reviewed-changes-requested`
- _"Is it ready to ship?"_ - `PR: reviewed-approved`

test
test
