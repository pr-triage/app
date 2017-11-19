[build badge]: https://travis-ci.org/sotayamashita/pr-label.svg?branch=master
[build url]:   https://travis-ci.org/sotayamashita/pr-label

# pr-label [![build status][build badge]][build url]

[![Greenkeeper badge](https://badges.greenkeeper.io/sotayamashita/pr-label.svg)](https://greenkeeper.io/)

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

## Deploy

```
now secret add pr-label-app-id <Your GitHub APP ID>
now secret add pr-label-private-key (cat <Your Private Key> | base64)
now secret add pr-label-webhook-secret <Your Webhook secret>

now secret ls
> 3 secrets found under you email address

  name                     created
  pr-label-app-id          ns ago
  pr-label-private-key     ns ago
  pr-label-webhook-secret  ns ago
```

```
now -e PR_LABEL_APP_ID=@pr-label-app-id
now -e PR_LABEL_PRIVATE_KEY=@pr-label-private-key
now -e PR_LABEL_WEBHOOK_SECRET=@pr-label-webhook-secret
```

## License

MIT © Sam Yamashita
