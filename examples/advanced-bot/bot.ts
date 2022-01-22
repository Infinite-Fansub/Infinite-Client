import { InfiniteClient } from "../../src";
import { token, mongoPath } from "../../config.json";
import { join } from "path"

new InfiniteClient(token, {
    intents: 32511,
    partials: ['USER', 'REACTION', 'MESSAGE', 'GUILD_MEMBER', 'CHANNEL'],
    useDatabase: true,
    databaseType: { type: "mongo", mongoPath },
    dirs: {
        slashCommands: join(__dirname, "./slashCommands"),
        events: join(__dirname, "./events")
    }
}).once("ready", (client) => {
    client.user.setPresence({
        status: "dnd",
        activities: [
            {
                name: "Infinite",
                type: "WATCHING"
            }
        ]
    })
})