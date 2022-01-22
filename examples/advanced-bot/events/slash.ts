import { Event, logger } from "../../../src";

export default {
    name: "example",
    event: "loadedSlash",
    type: "on", // this has to be `on` or it will only recieve the first command
    enabled: true,
    run: (command, type) => {
        if (type === "Global") logger.infinitePrint(`Global (/) command ${command} loaded`, true)
        else logger.infinitePrint(`Guild (/) command ${command} loaded`, true)
    }
} as Event<"loadedSlash">