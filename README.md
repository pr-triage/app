# pr-label [![Build Status](https://travis-ci.org/sotayamashita/pr-label.svg?branch=master)](https://travis-ci.org/sotayamashita/pr-label)

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

## License

MIT © Sam Yamashita
