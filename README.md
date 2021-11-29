# JavaScript

As this project has been primarily developed in and for TypeScript, a compiled JavaScript source has not been supplied. In order to fully make use of this project in plain JavaScript, the project must be first transpiled, or run in an environment which supports TypeScript execution.

# TypeScript

## Creating the bot
```ts
// Import the client
import { InfiniteClient } from "infinite-client";

// Package included in the standard node.js library relating to file directories.
// Used to maintain easy cross compatibility between operating systems.
import { join } from "path";

// We have a token stored in a local json file of the format *{ "token": "your-token" }*
// Alternative approaches may instead be used.
import { token } from "../config.json";

// Initialise the client passing the token and providing optional information.
// Most intellisense systems should acknowledge and supply the available options.
InfiniteClient(token, {
    intents: 32511, // 0b0111_1110_1111_1111
    useDatabase: true,
    databaseType: "mongo"
});
```

## Adding commands & events

There are two approaches for supplying commands and events:
- Including as additional options used during construction.
```ts
const client = new InfiniteClient(token, {
    intents: 32511,
    useDatabase: true,
    databaseType: "mongo",
    dirs: {
        slashCommands: join(__dirname, "./slashCommands"),
        commands: join(__dirname, "./commands"),
        events: join(__dirname, "./events")
    }
});
```
- Adding them later on in execution making use of the appropriate methods.
```ts
const client = new InfiniteClient(token, {
    intents: 32511,
    useDatabase: true,
    databaseType: "mongo"
});

// using methods of the custom client to load the command & event folders
client.addSlashCommands(join(__dirname, "./slashCommands"));
client.addCommands(join(__dirname, "./commands"));
client.addEvents(join(__dirname, "./events"));
```

## Listening to events

There are two ways of producing event handlers, the first of which being the standard approach.
```ts
// ready is only emited once the bot starts thats why we use "once" here instead of "on"
client.once("ready", async () => {
    console.log(`${client.user?.username} is Ready`)
})
```
The alternative however, is by making use of the event handler type, included using the same approach as standard commands.\
To do this create an events folder and add it like shown above, then create a TypeScript source file within.\
Intellisense systems should also acknowledge and operate under this approach, as long as the generic type is supplied.
```ts
// Importing the Event type from the library.
// The Event type requires 1 generic argument being the event type you wish to handle.
import { Event } from "infinite-client";

export default {
    // the event string must be the same as the generic type.
    event: "ready",
    type: "once",
    run: async (client) => {
        console.log(`${client.user?.username} is Ready`)
    }
} as Event<"ready">
```

## Creating slash commands
To create slash commands we will use the discord.js builders together with our handler, to install discord.js builders use `npm i @discordjs/builders`.\
Now create the slash commands folder and a `.ts` file inside, the way that slash commands are handled are pretty similar to the ones suggested on the discord.js guide
```ts
// import the oficial djs builder
import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "infinite-client";

export default {
    // create the command with the builder normally, the handler will take of everything
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replys with pong!"),
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
} as ISlashCommand
```

## Handling message commands
The traditional approach for handling message based commands are supported; again the handler is pretty similar to the one suggested on the discord.js guide.
```ts
import { ICommand } from "infinite-client";

export default {
    name: "ping",
    execute: async (message) => {
        message.reply("Pong!")
    }
} as ICommand
```

## Alternative way for types
Instead of doing `export default { ... } as ICommand` you can simply do `export default ICommand({ ... })`.\
This works for both commands and events.
```ts
export default Event<"ready">({
    event: "ready",
    type: "once",
    run: async (client) => {
        console.log(`${client.user?.username} is Ready`)
    }
})

// or 

export default ISlashCommand({
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with pong!"),
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
})
```
