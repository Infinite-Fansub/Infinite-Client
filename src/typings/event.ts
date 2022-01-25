import { ClientEvents } from "discord.js";
import { InfiniteClient } from "../client";
import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types/v9"

export type EventExecute<E extends keyof IClientEvents> = (...args: IClientEvents[E]) => Promise<IClientEvents | void> | void;

export interface IClientEvents extends ClientEvents {
    loadedSlash: [commands: RESTPostAPIApplicationCommandsJSONBody[], type: "Global" | string, client: InfiniteClient];
    deletedSlash: [type: "Global" | "Guild", client: InfiniteClient]
}

export interface Event<E extends keyof IClientEvents> {
    name?: string;
    event: E;
    type: "on" | "once";
    enabled?: boolean;
    run: EventExecute<E>;
};