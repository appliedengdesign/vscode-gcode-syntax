# Change Log

All changes to vscode-code-syntax will be documented here.

## v0.4.0 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.4.0)

Finally a major update to vscode-gcode-syntax!

### New Features

- Added `G65`, `M97` and `M99` to tree info
- Added spindle speed and direction to tree info
- Added `M03` and `M04` snippets
- Added `.001` extension to supported files ( [#11](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/11) )
- Added Status Bar implementation for Tree messages
- Added Stats view (Currently only displays number of Tool Changes)

### Fixes

- Added `E` feed rate colorization
- Fixed mocha test error `useColors -> color`
- Updated all dependencies
- Updated copyright info
- Refactored constants and removed hardcoded manifest
- Rewrote entire console logging to use Logger class (Future ability to specify log level)
- Modfied view contexts to change when not viewing g-code instead of hiding views
- Refactored import declations to improve performance
- Modified configuration variables
- Updated README with more information about settings.

### Other

- Added Contributor Covenant
- Added CODEOWNERS File
- Added markdownlint config

## v0.3.3 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.3.3)

- Updated dependencies to fix some security vulnerabilities
- Fixed syntax coloring for ```MOD``` and when using P with brackets ```P[ #1 + 1]```
- Migrated from the depreciated tslint to eslint

## v0.3.2 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.3.2)

- Fixed Markup with division symbol ( [#9](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/7) )
- Fixed typo in src manifest
- Updated dependencies

## v0.3.1 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.3.1)

- Added ```.prg``` file extension [#7](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/7)
- Moved activity bar icon into resources folder. ( [#5](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/5) )

## v0.3.0 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.3.0)

- Added G-Code Tree view of code.
- Cleaned up code for modularity
- Updated dependencies

## v0.2.0 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.2.0)

- Refactor extension code for new vscode extension syntax
- Added ```.eia``` file extension ( [#4](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/4) )
- Fixed compound macro variable syntax highlighting ( [#3](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/3) )
- Updated dependencies & dev dependencies
- Added standard vscode testing to source code
- Added dedicated output channel "G-Code" when activated

## v0.1.2 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.1.2)

- Fixed typo in README.MD
- Updated dependencies for security issues

## v0.1.1 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.1.1)

- Fixed Incorrect highlighting for DO / END ( [#2](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/2) )
- Fixed Math expressions incorrectly highlighted ( [#1](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/1) )

## v0.1.0 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.1.0)

- Initial Release
  