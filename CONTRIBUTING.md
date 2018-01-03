1. Fork it ( https://github.com/[my-github-username]/labeling-droid.git/fork )
1. Create your feature branch (git checkout -b my-new-feature)
1. Registering a GitHub App
1. `echo "APP_ID=<Your GitHub App ID>" >> .env`
1. Download your GitHub App Private key from setting page of it
1. Happy hacking with [Simulating Webhooks](https://probot.github.io/docs/simulating-webhooks/):

    ```
    # Example: Simulate when user create a pull request
    node_modules/.bin/probot simulate pull_request test/fixtures/pull_request.opened.json ./index.js

    # Example: Simulate when user add a review to the pull request
    node_modules/.bin/probot simulate review_pull_request test/fixtures/pull_request_review.submitted.approved.json ./index.js
    ```
1. `git add .`
1. `npm run commit`
1. Create a new Pull Request
