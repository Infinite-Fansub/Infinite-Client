import InfiniteClient from "../src/client";
import { token } from "../config.json";
import { join } from "path"

const client = new InfiniteClient(token, {
    intents: 32511,
    partials: ['USER', 'REACTION', 'MESSAGE', 'GUILD_MEMBER', 'CHANNEL'],
    useDatabase: true,
    databaseType: "mongo",
    dirs: {
        slashCommands: join(__dirname, "./commands"),
    }
})
client.once("ready", async () => {
    process.stdout.write(`${client.user?.username}`)

})