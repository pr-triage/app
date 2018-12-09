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

1.  [Fork][fork] the repository:

2.  Clone the repository:

    ```bash
    $ git clone git@github.com:<YOUR USERNAME>/app.git pr-triage
    $ cd pr-triage
    ```

3.  Configure and install the dependencies:

    ```bash
    $ npm install
    ```

4.  Copy .env.example to .env

    ```bash
    $ cp .env.example .env
    ```

    ```bash
    $ cat .env
    # The ID of your GitHub App
    APP_ID=
    WEBHOOK_SECRET=

    # Use `trace` to get verbose logging or `info` to show less
    LOG_LEVEL=trace

    # Go to https://smee.io/new set this to the URL that you are redirected to.
    WEBHOOK_PROXY_URL=
    ```

5.  Go to <https://smee.io/new> and get a proxy url:

    ```bash
    # Proxy URL is something like below:
    https://smee.io/xxxxxxxxxxxxxxx
    ```

6.  [Create a new GitHub app](https://github.com/settings/apps/new) with:

    -   GitHub App name
        -   Input [whatever].
    -   Homepage URL
        -   Input [whatever]. (e.g. <https://example.com>)
    -   Webhook URL
        -   Input [the URL which is generated with smee.io]. (e.g. <https://smee.io/xxxxxxxxxxxxxxx>)
    -   Webhook secret:
    -   Input `development`.
    -   Permissions
    -   Pull Request
        -   Select From List By [Access: Read & Write].
    -   Subscribe to events
        -   Select Checkbox [Pull Request].
        -   Select Checkbox [Pull request review].

7.  Download the private key and move it under the repository:

    ```bash
    $ mv /path/to/private-key.pem /path/to/pr-triage/   
    ```

8.  Edit .env with:

    -   Set the App ID to the `APP_ID=` of the app
    -   Set `development` to the `WEBHOOK_SECRET=`
    -   Set the URL which is generated with smee.io to the \`WEBHOOK_PROXY_URL=``

    ```bash
    $ cat .env
    # The ID of your GitHub App
    APP_ID=1234
    WEBHOOK_SECRET=development

    # Use `trace` to get verbose logging or `info` to show less
    LOG_LEVEL=trace

    # Go to https://smee.io/new set this to the URL that you are redirected to.
    WEBHOOK_PROXY_URL=https://smee.io/xxxxxxxxxxxxxxx
    ```

9.  Start the App on your local:

    ```bash
    $ npm run start:dev
    ```

10. Install the App into your repository.
11. Create a Pull Request.
12. Make sure that the App works correctly.

### Development

1.  Make sure the tests pass on your machine: `npm test`.
2.  Create a new branch: `git checkout -b my-branch-name`.
3.  Make your change, add tests, and make sure the tests still pass.
4.  Commit via `npm run commit`.
5.  Push to your fork and [submit a pull request][pr].
6.  Pat your self on the back and wait for your pull request to be reviewed and merged.

Here are a few things you can do that will increase the likelihood of your pull request being accepted:

-   Follow the [style guide][style] which is using Prettier. Any linting errors should be shown when running `npm run lint`.
-   Write and update tests.
-   Keep your changes as focused as possible. If there are multiple changes you would like to make that are not dependent upon each other, consider submitting them as separate pull requests.
-   Write a [good commit message](http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html).

Work in Progress pull requests are also welcome to get feedback early on, or if there is something blocked you.

## Resources

-   [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
-   [Using Pull Requests](https://help.github.com/articles/about-pull-requests/)
-   [GitHub Help](https://help.github.com)
