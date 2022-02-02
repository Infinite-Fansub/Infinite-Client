[![Git Package](https://github.com/Infinite-Fansub/Infinite-Client/actions/workflows/github-publish.yml/badge.svg)](https://github.com/Infinite-Fansub/Infinite-Client/actions/workflows/github-publish.yml)

# Installation

[![NPM](https://nodei.co/npm/infinite-client.png)](https://nodei.co/npm/infinite-client)

# Using the Library

## Creating the initial client

```js
// Import the client
const { InfiniteClient } = require("infinite-client");

// Package included in the standard node.js library relating to file directories.
// Used to maintain easy cross compatibility between operating systems.
const { join } = require("path");

// We have a token and a path for mongodb stored in a local json file of the format *{ "token": "your-token", "path": "your-uri" }*
// Alternative approaches may instead be used.
const { token, path } = require("./config.json");

// Initialise the client passing the token and providing optional information.
// Most intellisense systems should acknowledge and supply the available options.
const client = new InfiniteClient(token, {
    intents: 32511, // 0b0111_1110_1111_1111
    useDatabase: true,
    databaseType: { type: "mongo", path },
    /* There are two approaches for supplying commands and events:
    - Including as additional options used during construction. */
    dirs: {
        slashCommands: join(__dirname, "./slashCommands"),
        commands: join(__dirname, "./commands"),
        events: join(__dirname, "./events")
    }
});

// - Adding them later on in execution making use of the appropriate methods of the custom client to load the command & event folders
client.addSlashCommands(join(__dirname, "./slashCommands"));
client.addCommands(join(__dirname, "./commands"));
client.addEvents(join(__dirname, "./events"));
```

## Listening to events

There are two ways of producing event handlers, the first of which being the standard approach.

```js
// ready is only emited once the bot starts thats why we use "once" here instead of "on"
client.once("ready", async () => {
    console.log(`${client.user?.username} is Ready`)
})
```

The alternative however, is by making use of the event handler type included using the same approach as standard commands.\
To do this create an events folder and add it like shown above, then create a JavaScript source file within.\

```js
module.exports = {
    event: "ready",
    type: "once",
    run: async (client) => {
        console.log(`${client.user?.username} is Ready`)
    }
}
```

## Creating slash commands

To create slash commands we will use the discord.js builders together with our handler.\
Now create the slash commands folder and a JavaScript file inside, the way that slash commands are handled are pretty similar to the ones suggested on the discord.js guide

```js
// import the oficial djs builder
const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
    // create the command with the builder normally, the handler will take of everything
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replys with pong!"),
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
}
```

## Handling message commands

The traditional approach for handling message based commands are supported; again the handler is pretty similar to the one suggested on the discord.js guide.

```js
module.exports = {
    name: "ping",
    execute: async ({ message }) => {
        message.reply("Pong!")
    }
}
```

# Options

## Event Handler Options

| Syntax    | Description                                                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `name`    | *Optional*: The name will only be used to find the corresponding function on the events                                            |
| `event`   | The event that you want to listen to. Example: `"ready"`, `"messageCreate"`                                                        |
| `type`    | Type of listener, this being `on` or `once`                                                                                        |
| `enabled` | *Optional*: If the event is enabled or not (usefull to handle per-guild events), if no value is provided it will default to `true` |
| `run`     | Handle the event callback                                                                                                          |

### Our custom events

| Syntax         | Arguments                                                                                                        | Description                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `loadedSlash`  | commands: `Array<RESTPostAPIApplicationCommandsJSONBody>`, type: `"Global" \| guildId`, client: `InfiniteClient` | Emited when slash commands are loaded.                                          |
| `deletedSlash` | type: `"Global" \| "Guild"`, client: `Infinite Client`                                                           | Emited when slash commands are deleted using the `deleteSlashCommands` function |
| `redisReady`   | client: `InfiniteClient`                                                                                         | Emited when the redis client logs in                                            |
## Slash Command Handler Options

| Syntax        | Description                                                                                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `data`        | The slash command data to be sent to the api **We do not support raw json yet**                                                                                                                      |
| `description` | The discription is only added to the Map and not shown on the data sent do the api, this is to make a `help` command easier to make                                                                  |
| `Post`        | *Optional* Where the command will be posted, this can be the a guild id, an array of guild ids, `"ALL"` (All guilds the bot is in) or `"GLOBAL"`. If post is not provided it will default to `"ALL"` |
| `enabled`     | *Optional*: If the command is enabled or not (usefull to handle per-guild commands), if no value is provided it will default to `true`                                                               |
| `execute`     | Handle the interaction                                                                                                                                                                               |

### Slash Command Arguments

| Argument      | Type                 |
| ------------- | -------------------- |
| `interaction` | `CommandInteraction` |
| `client`      | `InfiniteClient`     |

## Traditional Command Handler Options

| Syntax        | Description                                                                                                                            |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | The name of the command, this is how the command will be called (\<prefix>commandName)                                                 |
| `description` | The discription is only added to the Map and not shown on the data sent do the api, this is to make a `help` command easier to make    |
| `enabled`     | *Optional*: If the command is enabled or not (usefull to handle per-guild commands), if no value is provided it will default to `true` |
| `execute`     | Handle the command                                                                                                                     |

### Traditional Command Arguments

| Argument  | Type             | Description                             |
| --------- | ---------------- | --------------------------------------- |
| `message` | `Message`        | The message which requested the command |
| `args`    | `Array<string>`  | The arguments supplied to the command   |
| `command` | `string`         | The name of the called command          |
| `client`  | `InfiniteClient` | The calling instance of the client      |
