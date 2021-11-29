# JavaScript
We do not support js yet

# TypeScript

## Creating the bot
```ts
// imports the client
import { InfiniteClient } from "infinite-client";
// path is already included with node, its just a way to reach to your folders easier, and prevents some bugs on linux
import { join } from "path";
// we have a token stored in a json *{ token: "your-token" }* but you can use other ways
import { token } from "../config.json";

// innitiate the client passing the token and providing what you desire, if you use vscode intelisense should show you all the options
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

// using the built in functions of the core to load the command & event folders
client.addSlashCommands(join(__dirname, "./slashCommands"));
client.addCommands(join(__dirname, "./commands"));
client.addEvents(join(__dirname, "./events"));
```

## Listening to events

There are two ways of doing this, you can either write them inside your index
```ts
// ready is only emited once the bot starts thats why we use "once" here instead of "on"
client.once("ready", async () => {
    console.log(`${client.user?.username} is Ready`)
})
```
or use the built in event handler.\
To do this create an event folder and add it like shown above, then create a file inside that ends in `.ts`.\
To create the listener its like creating another command and vscode should give you the intelisense for that but i will give an example anyways.
```ts
// importing the Event type from the library
// the Event type requires 1 generic argument and that argument should be the event you are working with
import { Event } from "infinite-client";

export default {
    //the event has to be the same as the generic, this is a "junky" way but the only one i was able to do it for the intelisense
    event: "ready",
    type: "once",
    run: async (client) => {
        console.log(`${client.user?.username} is Ready`)
    }
} as Event<"ready">
```

## Creating slash commands
To create slash commands we will use the discord.js builders together with our handler, to install discord.js builders use `npm i @discordjs/builders`.\
Now create the slash commands folder and a `.ts` file inside, the way that slash commands are handled are pretty similar to the ones on the discord.js guide
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
This is the old way of using commands but we support it for whoever wants to use it, again the hanlder is pretty similar to the one on the discord.js guide.
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
        .setDescription("Replys with pong!"),
    execute: async (interaction) => {
        interaction.reply("Pong!")
    }
})
```