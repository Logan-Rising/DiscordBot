# CHANGELOG

## v2.0

### Added

- Added new command handlers for different types of commands.
- Added serveral functions to manage messages, firebase, permissions, images, and discord functionality.
- Prettier formatting with .prettierrc file for formatting specification.
- Added gif editing capabilities for kick and ban commands.
- Added ability to use custom commands for separate instances of the code base via the src/custom_commands directory.
- Added automated initialization of Google Firebase for the provided commands via script in `src/setup/botsetup.js`.
- onKickBan() function added for when a user gets kicked or banned.
- Added a script in `src/setup/botsetup.js` to initialize bot when cloning the repository.

### Changed

- Changed database from local json to firebase to track command usage and image management.
- Separated shared functions into separate files.
- Changed all constants to be pulled from a constants.js file in src/constants.js for the code base to be run with different instances and reusability of code for other bots.
- Changed help command to work with new folder layout.
- Updated README file for bot initialization.
- Changed commands to have users[] and servers[] arrays for permissions instead of if statements inside the execute() function.

### Removed

- Removed single shared function.js file.
- Removed test command. New test command can be placed in src/custom_commands directory to be applicable to each running instance of the cade base.
- Removed template js file.
- Removed Yahtzee command until game is ready for release.
