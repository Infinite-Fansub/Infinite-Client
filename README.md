# JavaScript
We do not support js yet

# TypeScript

## Creating the bot
```ts
import { InfiniteClient } from "infinite-client";
import { join } from "path";
import { token } from "../config.json";

InfiniteClient(token, {
    intents: 32511,
    useDatabase: true,
    databaseType: "mongo"
});
```

## Adding commands & events

Commands and events can be added in 2 ways.
Adding them into the creation of the client
```ts
InfiniteClient(token, {
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
Or by adding them later with the functions
```ts
const client = InfiniteClient(token, {
    intents: 32511,
    useDatabase: true,
    databaseType: "mongo"
});

client.addSlashCommands(join(__dirname, "./slashCommands"));
client.addCommands(join(__dirname, "./commands"));
client.addEvents(join(__dirname, "./events"));
```

## Listening to events

There are two ways of doing this, you can either write them inside your index
```ts
client.once("ready", async () => {
    console.log(`${client.user?.username} is Ready`)
})
```
or use the built in event handler.\
To do this create an event folder and add it like shown above, then create a file inside that ends in `.ts`.\
To create the listener its like creating another command and vscode should give you the intelisense for that but i will give an example anyways.
```ts
import { Event } from "infinite-client";

export default {
    event: "ready",
    type: "once",
    enabled: true,
    run: async (client) => {
        console.log(`${client.user?.username} is Ready`)
    }
} as Event<"ready">
```

## Creating slash commands
To create slash commands we will use the discord.js builders together with our handler, to install discord.js builders use `npm i @discordjs/builders`.\
Now create the slash commands folder and a `.ts` file inside, the way that slash commands are handled are pretty similar to the ones on the discord.js guide
```ts
import { SlashCommandBuilder } from "@discordjs/builders";
import { ISlashCommand } from "infinite-client";

export default {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replys with pong!"),
    enabled: true,
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
} as ISlashCommand
```

## Handling message commands
This is the old way of using commands but we support it for whoever wants to use it, again the hanlder is pretty similar to the one on the discord.js guide.
```ts
import { ICommand } from "infinite-client";

export default {
    name: "ping",
    execute: async (message) => {
        message.reply("Pong!")
    }
}
```