# PRTriage

> GitHub App built with [Probot](https://github.com/probot/probot) that support pull request workflow


## Install

PRTriage does **"NOT"** have permission to `Read & Write` your code :see_no_evil:. For more details, see [Permission and Subscribe section](#permission-&-subscribe-event). If you have any question, please free to ask us via [creating an issue](https://github.com/pr-triage/pr-triage/issues/new?labels=question).

1. :runner: Go to [PRTriage App Page](https://github.com/apps/pr-triage)
1. :rocket: Click **Install**
1. :mag: Please choose a repository
1. :sparkles: That's it.


## How it works

<p>
  <img src="https://user-images.githubusercontent.com/1587053/35917561-f4928e02-0c51-11e8-95d3-81b4f44ed6d2.png" width="100%">
</p>

- Do nothing if your title of PR starts from `WIP`, `[WIP]` or `WIP:`.
- Add a `PR: unreviewed` label if your PR does not have any reviews for latest commit.
- Add a `PR: reviewed-changes-requested` label if your PR have reviewed and got **Change request** for latest commit.
- Add a `PR: review-approved` label if your PR have reviewed and got **Approve** for latest commit.


## Permission & Subscribe event

Here are permission and event PRTriage is requested and subscribe:

- :x: **No** access to code
- :white_check_mark: Read access to metadata
- :white_check_mark: Read and write access to pull requests to create, add and remove labels PRTriage manipulate.


## Develop

### Setup

1. Go to [PRTriage Sandbox App Page](https://github.com/settings/apps/pr-triage-sandbox)
  1. Download private key file and place it under project root.
  1. Set `APP_ID` in `.env` to the ID.
  1. Set `WEBHOOK_SECRET` in `.env` to the `development`.
1. Go to [seem.io](https://smee.io/) and click **Start a new channel**. Set `WEBHOOK_PROXY_URL` in `.env` to the URL.
1. Start probot on your local machine.

### Simulate

Simulate a pull request event:

```bash
$ ./node_modules/.bin/probot simulate pull_request test/simulates/pull_request.opened.json ./index.js
```

Simulate a pull request review event:

```bash
$ ./node_modules/.bin/probot simulate pull_request_review test/simulates/pull_request_review.submitted.approved.json ./index.js
```

### Test

Run all tests:

```bash
$ npm test
```

Run a single test:

```bash
$ ./node_modules/.bin/jest -t "<name in `describe` or `test`>"
```

## License

[MIT](LICENSE) © Sam Yamashita
