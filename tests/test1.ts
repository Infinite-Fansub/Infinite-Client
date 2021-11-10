import InfiniteClient from "../src/client";
import { token } from "../config.json"

const client = new InfiniteClient(token, { intents: 30, useDatabase: true, databaseType: "mongo" })
client.start()

client.once("ready", async () => {
    process.stdout.write(`${client.user?.username}`)
    process.exit(0)
})