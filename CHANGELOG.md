# Change Log

All changes to G-Code Language Extension will be documented here.

## v0.7.6 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.7.6)

### New Features

- Added additional configuration options for the Line Numberer

### Fixes

- Fixed issue where commands were not working [#47](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/47)
- Fixed regex for detecting comments when numbering
- Moved line numbering progress to lower statusbar
- Refactored Line Numberer code to use vscode editBuilder

### Other

- Added additional logging on initializtion
- Updated README
- Updated dependencies

## v0.7.5 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.7.5)

### Fixes

- Fixed typo in G01 tooltip
- Updated dependencies
- Added Laser/EDM/Swiss to machine type configuration (to match gcode-reference)

### Other

- Updated CodeQL Analysis to v2
- Updated prettier config
- Updated module to ES2021
- Changed usage of substr to slice
- Added sample to extension debug launch
- Fixed Mocha test
- Added node modules refresh script
- Renamed `views.ts` to `gView.ts`
- Renamed `webviews.ts` to `gWebview.ts`
- Fixed stale action settings
- Added lock older closed issues
- Added greetings automation
- Updated README

## v0.7.4 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.7.4)

### Other

- Updated dependencies
- Updated README
- Removed ProBot Stale and Added GitHub Actions Stale
- Updated CodeQL to v2

## v0.7.3 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.7.3)

### Fixes

- Added regexes for `rs274ngc` in `.ngc` files and refactored for better colorization [#40](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/40)
- Added `<` and `>` to bracket defintions

### Other

- Updated dependencies
- Updated VSCode engine to `^1.69.0`
- Updated README

## v0.7.2 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.7.2)

### Fixes

- Fixed highlighting syntax for `T` inside of other words [#40](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/40)

### Other

- Updated dependencies [#38](https://github.com/appliedengdesign/vscode-gcode-syntax/pull/38)
- Refactored some Regex to be more concise
- Updated VSCode engine to `^1.68.0`
- Update Typescript build to ES2021
- Updated README

## v0.7.1 [#](https://github.com/appliedengdesign/vscode-gcode-syntax/releases/tag/v0.7.1)

### New Features

- Added `.S` extension ( [#36](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/36) )

### Fixes

- Fixed debug console exception w/ M03 w/o spindle speed. [#34](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/34)

### Other

- Updated dependencies
- Updated copyright to 2022
- Removed eslint from `ForkTsCheckerWebpackPlugin` in `webpack.config.js` ( [Remove ESLint Support](https://github.com/TypeStrong/fork-ts-checker-webpack-plugin/issues/601) )
  
## v0.7.0 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.7.0)

### New Features

- Added line numbering command with settings in configuration
- Line numberer Quickpick options
- Added max filesize option to configuration [#32](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/32)

### Fixes

- Configuration files moved
- Added default configurations
- Updated dependencies
- Fixed link to issue queue [#30](https://github.com/appliedengdesign/vscode-gcode-syntax/pull/30)
- Imporoved highlighting for keywords and macro syntax [#33](https://github.com/appliedengdesign/vscode-gcode-syntax/pull/33)
- Fixed tool change to ignore comments [#31](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/31)

### Other

- Added trace-depreciation to launch.json file
- Updated README

## v0.6.2 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.6.2)

### Fixes

- Fixed syntax highlighting for larger numbers ( [#26](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/26))
- Updated dependencies

## v0.6.1 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.6.1)

### Fixes

- Fixed missing icons in tree / stats views
- Removed redundant refresh icons in stats view
- Added placeholder for stats without auto refresh enabled

## v0.6.0 [#](https://github.com/appliedengesign/vscode-gcode-syntax/releases/tag/v0.6.0)

### New Features

- Added new command that will turn selected text into a comment or revese (Available in Context menu)
- Hover over G/M code to get a short description of the code (Relies on [gcode-reference](https://github.com/appliedengdesign/gcode-reference) package for info)
- Machine Type selection in configuration selectively loads features
- Machine Type shown in status bar
- Added check for file over 10K lines, disables autorefresh of tree/stats, shows warning message ( [#23](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/23))
- Added `.g` extension ( [#24](https://github.com/appliedengdesign/vscode-gcode-syntax/issues/24) )

### Fixes

- Fixed block comment definition
- Removed stats enable setting

### Other

- Updated package description & badges
- Extension now packed with webpack for efficiency/speed
- Created some Mocha Unit tests
- Updated TypeScript config to use ES2020 and ESNext configuration
- Updated all dependencies
- Updated README

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
- Added commands to context menu for Nav Tree Refresh
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
  