import { Event, logger } from "../../../src";

export default {
    name: "example",
    event: "deletedSlash",
    type: "on",
    enabled: true,
    run: (type) => {
        if (type === "Global") logger.error(`Global (/) commands deleted`, true)
        else logger.error(`Guild (/) commands deleted`, true)
    }
} as Event<"deletedSlash">