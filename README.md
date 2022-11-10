[![Version](https://vsmarketplacebadge.apphb.com/version/appliedengdesign.vscode-gcode-syntax.svg)](https://marketplace.visualstudio.com/items?itemName=appliedengdesign.vscode-gcode-syntax)
[![Installs](https://vsmarketplacebadge.apphb.com/installs-short/appliedengdesign.vscode-gcode-syntax.svg)](https://marketplace.visualstudio.com/items?itemName=appliedengdesign.vscode-gcode-syntax)
[![Rating](https://vsmarketplacebadge.apphb.com/rating/appliedengdesign.vscode-gcode-syntax.svg)](https://marketplace.visualstudio.com/items?itemName=appliedengdesign.vscode-gcode-syntax)

[![GitHub Issues](https://badgen.net/github/open-issues/appliedengdesign/vscode-gcode-syntax)](https://github.com/appliedengdesign/vscode-gcode-syntax/issues)
![Github Stars](https://badgen.net/github/stars/appliedengdesign/vscode-gcode-syntax)
![Github Last Commit](https://badgen.net/github/last-commit/appliedengdesign/vscode-gcode-syntax/)
[![MIT License](https://badgen.net/badge/license/MIT)](https://opensource.org/licenses/MIT)

[![Follow @appliedengdesign](https://badgen.net/twitter/follow/appliedengdes)](https://twitter.com/appliedengdes)

<p align="center">
  <br />
  <img width="300" src="https://github.com/appliedengdesign/vscode-gcode-syntax/raw/master/images/logo.png" />
  <br /><br />
</p>

VSCode G-Code Syntax is the premier extension for editing G-Code inside of VSCode. Going past the simple syntax highlighting, this extension aims to turn your editor into a full blown g-code management suite. Building on the features of VSCode like Intellisense, snippets, debugging and more, we are able to offer nearly all of the features you would see in very expensive proprietary editors.

Additionally, by editing your G-Code inside of VSCode, you can take advantage of source control using Git to manage your g-code file versions.

![Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/screenshot.png)

>VSCode or [Visual Studio Code](https://code.visualstudio.com) is a FREE (as in beer), open source application for editing code of all kinds of programming languages. To make it even better, there is a great [marketplace](https://marketplace.visualstudio.com/VSCode) where you can download and add **extensions** to the application to support other languages, add features and more.

## Support VSCode-G-Code-Syntax

G-Code Syntax is generously offered to everyone free of charge, if you find it useful, please consider **supporting** the project by becoming a sponsor, sharing it, and letting your friends know!

Also, please [write a review](https://marketplace.visualstudio.com/items?itemName=appliedengdesign.vscode-gcode-syntax&ssr=false#review-details), [star me on GitHub](https://github.com/appliedengdesign/vscode-gcode-syntax 'Star me on GitHub'), and follow me on [Twitter](https://twitter.com/appliedengdes) or [Instagram](https://instagram.com/appliedengdes).

You can also subscribe to our videos over on [YouTube](https://youtube.com/c/AppliedEngDesignUSA).

## Features

This extension adds language syntax for CNC G-Code, code snippets, and colorization.

### Tree View

- Tree View shows an overview of the operations in the G-Code Program

![Tree Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/tree-screenshot.png)

### Stats View

- Stats View shows a number of stats like tool changes, runtime, etc.

![Stats Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/stats-screenshot.png)

### Hovers

- Hovering over G/M codes will show a short description of the code
- Descriptions for the codes are taken from the sister project: [gcode-reference](https://github.com/appliedengdesign/gcode-reference)
- Hovers are dependent on the machine type selected

![Hovers Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/hovers-screenshot.png)

### Status Bars

- G-Code adds three informative sections to the VSCode status bar area
  - Tree Status (Dirty or Up to Date) depending on Refresh needed
  - Current units as set by settings (Auto, Inch or Metric)
  - Machine Type as set by settings
  - Ok there's a little heart there too.

![Status Bar Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/statusbar-screenshot.png)

### Context Menu

- G-Code adds several commands to the context menu when viewing g-code
  - Change selected code into a comment
  - Refresh Stats
  - Refresh Tree
  - Remove Comment from selected code

![Context Menu Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/context-menu-screenshot.png)

## Current Supported File Extensions

```text
| .001   | .apt | .aptcl | .cls   | .cnc | .din | .dnc | .ecs |
| .eia   | .fan | .fgc   | .fnc   | .g   | .g00 | .gc  | .gcd |
| .gcode | .gp  | .hnc   | .knc   | .lib | .m   | .min | .mpf |
| .mpr   | .msb | .nc    | .ncc   | .ncd | .ncf | .ncg | .nci |
| .ncp   | .ngc | .out   | .pim   | .pit | .plt | .ply | .prg |
| .pu1   | .rol | .S     | .sbp   | .spf | .ssb | .sub | .tap |
| .xpi   |      |        |        |      |      |      |      |
```

If you would like another file extension supported by this extension, please [open an issue](https://github.com/appliedemgdesign/vscode-gcode-syntax/issues).

## Installation

Install from Extensions Marketplace or manually install the `vsix` file.

## Usage

Install & activate extension. Extension activates when you open a file marked for the `gcode` language.

Tree view is enabled by default and can be access from the G icon on the activity bar.

## G-Code Syntax Settings

G-Code Syntax is customizable and provides many configuration settings to allow the personalization of almost all features.

| Name                                 | Description                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `gcode.general.hovers.enabled`            | Enable or Disable the hovers to show G-Code information                                |
| `gcode.general.machineType`               | Choose the machine type for extension (Mill is default)                                |
| `gcode.general.statusBars.enabled`        | Enable or Disable the G-Code status bars                                               |
| `gcode.general.statusbars.alignment`      | Choose the alignment of the status bars (Left is default)                              |
| `gcode.general.units`                     | Choose the units for the file. Options are Auto, Inch or Metric                        |
| `gcode.general.outputLevel`               | Configure Output level for debugging purposes                                          |
| `gcode.lineNumberer.addSpaceAfter`        | Add space after line number                                                            |
| `gcode.lineNumberer.defaultIncrement`     | Default Line Numberer Increment                                                        |
| `gcode.lineNumberer.defaultStart`         | Default Line Numberer Start                                                            |
| `gcode.lineNumberer.enableQuickPick`      | Enable or Disable Input for the Line Numberer (Will use above defaults)                |
| `gcode.lineNumberer.frequency`            | Frequency of line number additions (Every Line or at Tool Changes)                     |
| `gcode.lineNumberer.ignoreBlank`          | Ignore Blank lines when numbering                                                      |
| `gcode.lineNumberer.ignoreComments`       | Ignore Comments when numbering                                                         |
| `gcode.lineNumberer.ignoreExtra`          | Additional characters to ignore (Beginning of Line, Default is %)                      |
| `gcode.lineNumberer.ignoreProgramNumbers` | Ignore Program numbers, e.g. `O12345`                                                  |
| `gcode.lineNumberer.matchLineNumber`      | When numbering, match the N number to file's line number. (Default is off)             |
| `gcode.views.maxAutoRefresh`              | Value for limiting the autoRefresh maximum lines                                       |
| `gcode.views.navTree.autoRefresh`         | Tree auto-refreshes as changes are made to the g-code. ( Disabled by default )         |
| `gcode.views.stats.autoRefresh`           | Auto-refresh the stats view when changes are made to the g-code. (Disabled by default) |
| `gcode.views.webviews.enabled`            | Enable or disable the webviews                                                         |

![Settings Screenshot](https://raw.githubusercontent.com/appliedengdesign/vscode-gcode-syntax/master/images/settings-screenshot.png)

## Known Issues

Please visit our [GitHub Issues](https://github.com/appliedengdesign/vscode-gcode-syntax/issues) page for any open issues.

## TODO

- Add more snippets
- Add additional tree items.
- Machining Calculator
- More Statistics
- G-Code Debugging
- Backplotter
- Semantic Highlighting
- Programmatic Language Server

Visit our [projects page](https://github.com/appliedengdesign/vscode-gcode-syntax/projects) for future roadmaps.

## Changelog

Latest Version: v0.7.7

Please refer to our [CHANGELOG](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CHANGELOG.md) doc.

## Contributing

If you work like to help contribute to the code or this project, please fork away and submit pull requests!

For more information on contributing, please refer to the [CONTRIBUTING](https://github.com/appliedengdesign/vscode-gcode-syntax/blob/master/CONTRIBUTING.md) doc.

### Contributors

- Mike Centola ([@mikecentola](https://github.com/mikecentola)) - [contributions](https://github.com/appliedengdesign/vscode-gcode-syntax/commits?author=mikecentola)
- Zach Allaun ([@zachallaun](https://github.com/zachallaun)) - [contributions](https://github.com/appliedengdesign/vscode-gcode-syntax/commits?author=zachallaun)
- Patrick Connolly ([@patcon](https://github.com/patcon)) - [contributions](https://github.com/appliedengdesign/vscode-gcode-syntax/commits?author=patcon)

## About Applied Eng & Design

We are a full service engineering and design firm, specializing in CAD/CAM, CNC milling, rapid prototyping, training and more.  We also like to dabble in Arudino / RaspberryPi projects, electronics, drones and robotics projects! Subscribe to our YouTube channel for videos on our projects, screencast tutorials, and more!

Follow us on [Twitter](https://twitter.com/appliedengdes) & [Instagram](https://instagram.com/appliedengdes), and like our [Facebook Page](https://facebook.com/appliedengdesign)!

## License

This extension is licensed under the [MIT License](https://opensource.org/licenses/MIT).
