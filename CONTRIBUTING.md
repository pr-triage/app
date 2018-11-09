## Contributing

[fork]: /fork
[pr]: /compare
[style]: https://prettier.io/
[code-of-conduct]: CODE_OF_CONDUCT.md

Hi there! We're thrilled that you'd like to contribute to this project. Your help is essential for keeping it great.

Please note that this project is released with a [Contributor Code of Conduct][code-of-conduct]. By participating in this project you agree to abide by its terms.

## Issues and PRs

If you have suggestions for how this project could be improved, or want to report a bug, open an issue! We'd love all and any contributions. If you have questions, too, we'd love to hear them.

We'd also love PRs. If you're thinking of a large PR, we advise opening up an issue first to talk about it, though! Look at the links below if you're not sure how to open a PR.

## Submitting a pull request

### Setup
1. [Fork][fork] and clone the repository.
1. Clone this repository:
   ```bash
   git clone git@github.com:<YOUR USERNAME>/app.git
   ```
1. Configure and install the dependencies: `npm install`.
1. Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   ```
1. Create a webhook proxy url with https://smee.io/new.
1. [Create a new GitHub App](https://github.com/settings/apps/new) with:
  - GitHub App name
    - Input [whatever you want]
  - Homepage URL
    - Input [whatever you want]
  - Webhook URL
    - Input [WEBHOOK_PROXY_URL]
  - Permissions
    - Pull request
      - Select From List By [Access: Read & Write]
  - Subscribe to events
    - Select Checkbox [Pull request]
    - Select Checkbox [Pull request review]
1. Download the private key and move it to your project's directory.
1. Edit `.env` and set `APP_ID` to the `APP_ID=` of the app you just created and set `WEBHOOK_PROXY_URL` to the `WEBHOOK_PROXY_URL=`
1. Start the app
   ```
   npm run dev
   ```

### Develop
1. Make sure the tests pass on your machine: `npm test`.
1. Create a new branch: `git checkout -b my-branch-name`.
1. Make your change, add tests, and make sure the tests still pass.
1. Commit via `npm run commit`.
1. Push to your fork and [submit a pull request][pr].
1. Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

- Follow the [style guide][style] which is using Prettier. Any linting errors should be shown when running `npm run lint`.
- Write and update tests.
- Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
- Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

## Resources

- [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
- [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
- [GitHub Help](https://help.github.com)
