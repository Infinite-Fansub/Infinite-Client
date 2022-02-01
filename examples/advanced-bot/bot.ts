import { InfiniteClient } from "../../src";
import { token, path } from "../../config.json";
import { Partials, ActivityType } from "discord.js";
import { join } from "path"

new InfiniteClient(token, {
    intents: 32511,
    partials: [Partials.User, Partials.Reaction, Partials.Message, Partials.GuildMember, Partials.Channel],
    useDatabase: true,
    databaseType: { type: "mongo", path },
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
                type: ActivityType.Watching
            }
        ]
    })
})