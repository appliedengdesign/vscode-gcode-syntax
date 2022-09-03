# Contribute to VSCode GCode Syntax

Thank you for your interest in contributing to the VSCode GCode Syntax project. Please note the [Code of Conduct](CODE_OF_CONDUCT.md) document and follow it in all of your interactions with this project.

There are a variety of ways you can contribute to this project.

- Help answer issues or questions on using the extension
- Find Bugs and Fix them!
- Work on new features!
- Fix Typos! (I make a lot of them)
- Edit Documentation

Here are a couple guidelines to get you started...

## Getting Started

To contribute to [VSCode GCode Syntax](https://github.com/appliedengdesign/vscode-gcode-syntax), you need to fork this repository and submit a pull request for any changes.

- [How to fork a repository](https://help.github.com/articles/fork-a-repo)
- [How to make a pull request](https://help.github.com/articles/creating-a-pull-request/)
- [Changing a commit message](https://help.github.com/articles/changing-a-commit-message/)
- [How to squash commits](https://help.github.com/articles/about-pull-request-merges/)

Search open/closed issues before submitting any code changes because someone may have pushed the same code before.

Please create an issue _before_ creating your pull request.

### Branches

Create a local working branch that is specific to the scope of the changes that you want to make and then submit a pull request when your changes are ready. Each branch you create should be as specific as possible to streamline work flow and to reduce the possibility of merge conflicts. For instance, consider creating a branch to work on documentation or to fix a typo.

### Formatting

This project contains an [`.editorconfig`](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/main/.editorconfig) file. If your IDE or code editor doesn't natively support it, please install the [EditorConfig](https://editorconfig.org) plugin.

This project uses [prettier](https://prettier.io/) for code formatting. You can run prettier across the code by calling `npm run pretty` from a terminal.

To format the code as you make changes you can install the [Prettier - Code formatter](https://marketplace.visualstudio.com/items/esbenp.prettier-vscode) extension.

Add the following to your User Settings to run prettier:

`"editor.formatOnSave": true,`

### Linting

This project uses [ESLint](https://eslint.org/) for code linting. You can run ESLint across the code by calling `npm run lint` from a terminal. Warnings from ESLint show up in the `Errors and Warnings` quick box and you can navigate to them from inside VS Code.

To lint the code as you make changes you can install the [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension.

### Update the README

If this is your first contribution to GCode Reference, please give yourself credit by adding yourself to the _Contributors_ section of the [README](README.md) in the following format:

- `Your Name ([@<your-github-username>(https://github.com/<your-github-username)]) - [contributions](https://github.com/appliedengdesign/vscode-gcode-syntax/commits?author=<your-github-username>`

### Signing Your Commits

This project requires that commits are GPG signed. This ensures that YOU are really the author of your commit, and the code is REALLY what you wrote.

Check out this article: [How (and why) to sign Git commits](https://withblue.ink/2020/05/17/how-and-why-to-sign-git-commits.html)

### Authoring Tools

[Visual Studio Code](https://code.visualstudio.com) is a preferred tool to work on this project.

#### Recommended Extensions

- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

### Submitting a Pull Request

Please follow all instructions in the [PR template](.github/PULL_REQUEST_TEMPLATE.md).

- Push your changes to your branch in your fork of the repository.
- Submit a pull request to the [master](https://github.com/appliedengdesign/master-syntax/tree/master) of the [vscode-gcode-syntax](https://github.com/appliedengdesign/vscode-gcode-syntax) respository.
- Make sure to explicitly say not to complete pull request if you are still making changes.

## Additional Resources

- [GitHub Docs](http://help.github.com/)
- [GitHub Pull Request Docs](http://help.github.com/send-pull-requests/)
- [Successful Git Branching Model](http://nvie.com/posts/a-successful-git-branching-model/)
  