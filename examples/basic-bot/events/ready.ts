import { Event } from "../../../src/index";

export default {
    name: "example",
    event: "ready",
    type: "once",
    enabled: true,
    run: async (client) => {
        console.log(`${client.user?.username} is Ready`)
    }
} as Event<"ready">