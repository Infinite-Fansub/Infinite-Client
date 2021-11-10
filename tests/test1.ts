import InfiniteClient from "../src/client";
import { token } from "../config.json"

const client = new InfiniteClient(token, { intents: 30 })
client.start()

client.once("ready", async () => {
    process.stderr.write(`${client}`)
})