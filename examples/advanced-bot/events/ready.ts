import { Event } from "../../../src";
import { logger } from "../../../src";

export default {
    name: "example",
    event: "ready",
    type: "once",
    enabled: true,
    run: async (client) => {
        logger.infinitePrint(`${client.user?.username} is Ready`, true)
    }
} as Event<"ready">
