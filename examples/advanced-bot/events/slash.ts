import { Event, logger } from "../../../src";

export default {
    name: "example",
    event: "loadedSlash",
    type: "once",
    run: (commands) => {
        commands.forEach((cmd) => {
            logger.defaultPrint(`Loaded ${cmd.name} (/) command`, true)
        });
    }
} as Event<"loadedSlash">