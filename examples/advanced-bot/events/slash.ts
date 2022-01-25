import { Event, logger } from "../../../src";

export default {
    name: "example",
    event: "loadedSlash",
    type: "on", // this has to be `on` or it will only recieve the first command
    enabled: true,
    run: (command, type) => {
        if (type === "Global") command.forEach((command) => logger.infinitePrint(`Global (/) command loaded: ${command.name}`, true))
        else command.forEach((command) => logger.infinitePrint(`Guild (/) command ${command.name} loaded`, true))
        console.log("T")
    }
} as Event<"loadedSlash">