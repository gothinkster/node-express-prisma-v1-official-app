# Contributing to RealWorld

We would love for you to contribute to RealWorld and help make it even better than it is
today! As a contributor, here are the guidelines we would like you to follow:

- [Code of Conduct](#coc)
- [Question or Problem?](#question)
- [Issues and Bugs](#issue)
- [Feature Requests](#feature)
- [Submission Guidelines](#submit)
- [Coding Rules](#rules)
- [Commit Message Guidelines](#commit)

## <a name="coc"></a> Code of Conduct

Help us keep RealWorld open and inclusive. Please read and follow our [Code of Conduct][coc].

## <a name="question"></a> Got a Question or Problem?

Do not open issues for general support questions as we want to keep GitHub issues for bug reports and feature requests.  
For open discussions, we encourage you to use the [Github Discussions][github-discussions] channels of the RealWorld repository.

## <a name="issue"></a> Found a Bug?

If you find a bug in the project, you can help us by
[submitting an issue][github-issue] to our [GitHub Repository][github]. Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="feature"></a> Missing a Feature?

This repository follows the RealWorld [specs][github-spec].  
Please open feature requests on the RealWorld [repository][github-feature].

## <a name="submit"></a> Submission Guidelines

### <a name="submit-issue"></a> Submitting an Issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

You can file new issues by selecting from our [new issue templates][github-choose] and filling out the issue template.

### <a name="submit-pr"></a> Submitting a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub](https://github.com/gothinkster/node-express-prisma-v1-official-app/pulls) for an open or closed PR
   that relates to your submission. You don't want to duplicate effort.
1. Be sure that an issue describes the problem you're fixing, or documents the design for the feature you'd like to add.
   Discussing the design up front helps to ensure that we're ready to accept your work.
1. Fork the gothinkster/realworld repo.
1. Make your changes in a new git branch:

   ```bash
   git checkout -b my-fix-branch main
   ```

1. Create your patch.

1. Commit your changes using a descriptive commit message that follows our
   [commit message conventions](#commit).

1. Push your branch to GitHub:

   ```bash
   git push origin my-fix-branch
   ```

1. In GitHub, send a pull request to `node-express-prisma-v1-official-app:main`.

- If we suggest changes then:

  - Make the required updates.
  - Rebase your branch and force push to your GitHub repository (this will update your Pull Request):

    ```bash
    git rebase main -i
    git push -f
    ```

That's it! Thank you for your contribution!

#### After your pull request is merged

After your pull request is merged, you can safely delete your branch and pull the changes
from the main (upstream) repository:

- Delete the remote branch on GitHub either through the GitHub web UI or your local shell as follows:

  ```bash
  git push origin --delete my-fix-branch
  ```

- Check out the main branch:

  ```bash
  git checkout main -f
  ```

- Delete the local branch:

  ```bash
  git branch -D my-fix-branch
  ```

- Update your main with the latest upstream version:

  ```bash
  git pull --ff upstream main
  ```

## <a name="commit"></a> Commit Message Guidelines

> These guidelines have been added to the project starting from <include date>

We have very precise rules over how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format

Each commit message consists of a **header**, a **body** and a **footer**. The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

The **header** is mandatory and the **scope** of the header is optional.

Any line of the commit message cannot be longer 100 characters! This allows the message to be easier
to read on GitHub as well as in various git tools.

The footer should contain a [closing reference to an issue](https://help.github.com/articles/closing-issues-via-commit-messages/) if any.

Samples:

```
docs(changelog): update changelog to beta.5
```

### Type

Must be one of the following:

- **docs**: Documentation only changes
- **feat**: A new feature
- **fix**: A bug fix

### Scope

The scope should be the name of the npm package affected (as perceived by the person reading the changelog generated from commit messages).

The following is the list of supported scopes:

- **specs**
- **project**

### Subject

The subject contains a succinct description of the change:

- use the imperative, present tense: "change" not "changed" nor "changes"
- don't capitalize the first letter
- no dot (.) at the end

### Body

Just as in the **subject**, use the imperative, present tense: "change" not "changed" nor "changes".
The body should include the motivation for the change and contrast this with previous behavior.

### Footer

The footer should contain any information about **Breaking Changes** and is also the place to
reference GitHub issues that this commit **Closes**.

**Breaking Changes** should start with the word `BREAKING CHANGE:` with a space or two newlines. The rest of the commit message is then used for this.

Samples :

```
Close #394
```

```
BREAKING CHANGE:
change login route to /users/login
```

[coc]: https://github.com/gothinkster/node-express-prisma-v1-official-app/blob/main/CODE_OF_CONDUCT.md
[github]: https://github.com/gothinkster/node-express-prisma-v1-official-app
[github-issue]: https://github.com/gothinkster/node-express-prisma-v1-official-app/issues/new?assignees=&labels=bug&template=---bug-report.md&title=
[github-feature]: https://github.com/gothinkster/realworld/issues/new?assignees=&labels=enhancement&template=---feature-request.md&title=
[github-choose]: https://github.com/gothinkster/node-express-prisma-v1-official-app/issues/new/choose
[github-discussions]: https://github.com/gothinkster/realworld/discussions
[github-spec]: https://github.com/gothinkster/realworld/tree/master/spec
