# Tables of Contents

-   [About](#about)
-   [How To Use](#how-to-use)
-   [Reccomendations](#recommendations)

## About

This project is made to be a versitile Discord bot that with a little initialization, anyone can run with their own personal Discord bot. The primary functions of the bot are to provide administrator help for Discord servers, image management, game hosting and generalized commands that users can interact with the bot through. The bot is made to be run cross platform between macOS and Windows. One of the key features of this bot is to provide bot usage information via Google Firebase. Bot usage refers to how many messages the bot is reading and sending as well as how many times commands have been used. Utilizing Google Firebase allows for this information to be accessed from multiple platforms including the companion Android mobile app DiscordBotDashboard.

## How To Use

Install [Node JS].

Create a Discord application through the [Developer Portal].

Authenticate the bot via [OAuth2] by checking "bot" in the "SCOPES" section and checking "Administrator" in the "BOT PERMISSIONS" section.

Invite the bot to a server with the link generated by the previous step.

Create a [Google Firebase] project. Navigate to the `firebaseConfig` object under the general Firebase project settings and save the `firebaseConfig` for later.

Clone the [DiscordBot] repository onto your local machine.

Navigate to the directory that the bot was cloned into and run the following command:

```
npm install
```

Navigate to the `src/setup` directory in Command Prompt (Windows) or Terminal (macOS). Run the following command to set up the needed directories and files:

```
node botsetup.js
```

Once the script is finished, find the `constant.js` file located in `src/constants/constants.js` and fill in all of the variables as described in the comments.

Once the `constants.js` file is filled in, run the following command, ensuring the firebaseConfig is correct from your Google Firebase project.

```
node initializedatabase.js
```

Both of those scripts set up the needed information for the bot to be able to run successfully.

That is it! The bot is ready to run. See [Recommendations](#recommendations) for things to do next.

## Recommendations

For commands that you have created for your instance of the Discord bot, store them in `src/custom_commands` for ease of retrieving new releases.

Make the `src/custom_commands` directory into a GitHub repo that you can use to track your own commands. Essentially a repo inside the repo. This directory is ignored via the `.gitignore` file and won't be tracked by this repo.

For editing gifs, see the [canvas-gif] GitHub repository for more information. Example of how this is used is in the `onKickBan()` function. When a user is kicked/banned, a gif is edited and sent in the channel for the main instance of this bot

For formatting your code to align with styling provided by [Prettier Formatter], run this command from the command line, where `path` is the path to a specific file or directory

```
npx prettier --write <path>
```

Store your files that are not tracked by git, such as `constants.js` and `customfunctions.js`, somewhere in the cloud if you intend to run on multiple computers.

To run this project locally on a pc, set up a .bat file that launched on startup of your pc to run `node bot.js`. This will run the bot when your pc is powered.

[Node JS]: https://nodejs.org/en
[Discord JS]: https://Discord.js.org/
[Google Firebase]: https://firebase.google.com/?gad=1&gclid=Cj0KCQjwzdOlBhCNARIsAPMwjbwsfaH4JpU6-t17n2vcnwwPp2mO-GNbUWrTj_7uWTxdCmZhMEAX0XMaAjktEALw_wcB&gclsrc=aw.ds
[Prettier Formatter]: https://prettier.io/
[Developer Portal]: https://Discord.com/developers/applications
[OAuth2]: https://Discord.com/developers/docs/topics/oauth2
[DiscordBot]: https://github.com/Logan-Rising/DiscordBot
[canvas-gif]: https://github.com/newtykins/canvas-gif
