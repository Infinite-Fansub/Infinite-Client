import { Event } from "../../../src";

export default {
    name: "example",
    event: "loadedSlash",
    type: "once",
    run: (commands) => {
        commands.forEach((cmd) => {
            console.log(cmd.name)
        });
    }
} as Event<"loadedSlash">