[build badge]: https://travis-ci.org/sotayamashita/pr-label.svg?branch=master
[build url]:   https://travis-ci.org/sotayamashita/pr-label
[greenkeeper badge]: https://badges.greenkeeper.io/sotayamashita/pr-label.svg
[greenkeeper url]:   https://greenkeeper.io/

# pr-label [![build status][build badge]][build url] [![greenkeeper status][greenkeeper badge]][greenkeeper url]

<p>
  <a href="https://www.patreon.com/bePatron?u=6995574" target="_blank">
    <img src="https://c5.patreon.com/external/logo/become_a_patron_button.png" height="40px" />
  </a>
</p>

> Add a label automatically to know PR status at first glance.

## Development

1. Registering a GitHub App
2. `echo "APP_ID=<Your GitHub App ID>" >> .env`
3. Download your GitHub App Private key from setting page of it
4. Happy hacking with [Simulating Webhooks](https://probot.github.io/docs/simulating-webhooks/):

   ```
   # E.g)
   node_modules/.bin/probot simulate pull_request test/fixtures/pull_request.opened.json ./index.js

   # E.g)
   node_modules/.bin/probot simulate review_pull_request test/fixtures/pull_request_review.submitted.approved.json ./index.js
   ```
