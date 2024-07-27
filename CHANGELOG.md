# CHANGELOG

## v3.0

### Added

-   Firestore logging every 5 minutes for bot active status
-   Update server count every 5 minutes
-   Message filter for messages with customizablity via commands for individual servers
-   Cache for message filters to reduce Firestore reads
-   Ability to fetch user profile picture based on id as well as tag
-   Added functionality for slash commands
-   Added reaction role slash command with complete customizability

### Changed

-   Updated to Discord.js 14
-   Move custom functions to constants.js file
-   Reorganize project to put all source code under /src
-   Changed setup scripts and setup information to be located under /setup

### Removed

-   Removed discord-reply package and use native reply functionality

## v2.0

### Added

-   Added new command handlers for different types of commands.
-   Added serveral functions to manage messages, firebase, permissions, images, and discord functionality.
-   Prettier formatting with .prettierrc file for formatting specification.
-   Added gif editing capabilities for kick and ban commands.
-   Added ability to use custom commands for separate instances of the code base via the src/custom_commands directory.
-   Added automated initialization of Google Firebase for the provided commands via script in `src/setup/botsetup.js`.
-   onKickBan() function added for when a user gets kicked or banned.
-   Added a script in `src/setup/botsetup.js` to initialize bot when cloning the repository.

### Changed

-   Changed database from local json to firebase to track command usage and image management.
-   Separated shared functions into separate files.
-   Changed all constants to be pulled from a constants.js file in src/constants/constants.js for the code base to be run with different instances and reusability of code for other bots.
-   Changed help command to work with new folder layout.
-   Updated README file for bot initialization.
-   Changed commands to have users[] and servers[] arrays for permissions instead of if statements inside the execute() function.

### Removed

-   Removed single shared function.js file.
-   Removed test command. New test command can be placed in src/custom_commands directory to be applicable to each running instance of the cade base.
-   Removed template js file.
-   Removed Yahtzee command until game is ready for release.
