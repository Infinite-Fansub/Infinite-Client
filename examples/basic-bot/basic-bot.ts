import { InfiniteClient } from "../../src";
import { token, path } from "../../config.json";
import { join } from "path"

new InfiniteClient(token, {
    intents: 32511,
    useDatabase: true,
    databaseType: { type: "mongo", path },
    dirs: {
        slashCommands: join(__dirname, "./slashCommands"),
        events: join(__dirname, "./events")
    }
})
