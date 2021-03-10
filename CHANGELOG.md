# Change Log

All changes to vscode-code-syntax will be documented here.

## v0.5.1 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.5.1)

### Fixes

- Fixed Runtime Stats error in circular interpolation [#22](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/22)
- Fixed Runtime Stats Error with incorrect Values [#22](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/22)
- Fixed colorization of H/T/D codes with period at the end

### Other

- Added extra launch debugging configurations
- Updated [README.md](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/README.md)

## v0.5.0 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.5.0)

### New Features

- Added basic runtime calculation to Stats View
- Added Units to Status Bar ( Can manually set or set to Auto to detect ```G20/G21```)
- Added Configuration for Units, Status Bar
- Added support status bar Icon
- Added commands to status bar for Nav Tree Refresh
- Added file extensions: `.aptcl`, `.gp`, `.msb`, `.ncd`, `.ncf`, `.nci`, `.pim`, `.pit`, `.pu1`, `.spf`
- Added `G04` Dwell to Nav Tree
- Added `G74`, `G81`, `G82`, `G83`, `G84`, `G85`, `G86`, `G87`, `G88`, `G89` cycles to Nav Tree
- Added `G47` engraving to Nav Tree
- Added `M00` / `M01` to Nav Tree
- New Version Welcome
  
### Fixes

- Refactor Status Bar Code
- Fixed command references ( [#18](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/14) )
- Changes to events code
- Removed unncessary context paremeter in classes
- Major fixes to the syntax highlighting / colorization regex's
- Fixed Nav Tree Coolant to include HPC / TSC ( `M88` / `M89` )
- Updated all dependencies
- Clicking on Units on Status bar brings you to G-Code Settings
- Refactor all code to match eslint / prettier settings
- Fixed typo in [CONTRTIBUTING.md](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CONTRIBUTING.md) [#20](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/15)
- Added incremental calculation to run-time
- Fixed Run-Time stats to include circular interpolation
- Fixed activation time logging
- Moved URI's to constants
- Updated [README.md](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/README.md)

### Other

- Updated markdownlint config
- Added gitattributes file
- Updated tsconfig to ES2019
- Added CodeIcons to constants
- Updated README
- Added [SECURITY.md file](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/SECURITY.md)
- Updated ProBot stale file
- Updated vscodeignore file
- Added prettier to clean up code
- Updated `.eslintrc.js` and changed to `.eslintrc.json`
- Converted all files to LF from CRLF
- Updated eslint config
- Updated Logger to log errors
- Refactor `globalState` management into `StateController`
- Added pull request & issue templatea

## v0.4.1 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.4.1)

### Fixes

- Added `.ngc` file extension to supported files ( [#14](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/14))
- Added file extensions for Okuma OSP controls ( [#15](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/15))
- Fixed colorization of G-Codes with dot ( [#16](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/16))
- Fixed some colorization issues
- Refactor regexp for syntax colorization
- Updated all dependencies

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
  