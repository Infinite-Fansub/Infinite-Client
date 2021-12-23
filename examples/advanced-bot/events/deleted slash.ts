import { Event, logger } from "../../../src";

export default {
    name: "example",
    event: "deletedSlash",
    type: "once",
    run: () => {
        logger.error("Deleted all slash commands")
    }
} as Event<"deletedSlash">