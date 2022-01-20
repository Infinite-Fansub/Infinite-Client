import { ClientEvents } from "discord.js";
import { InfiniteClient } from "../client";

export type EventExecute<E extends keyof IClientEvents> = (...args: IClientEvents[E]) => Promise<IClientEvents | void> | void;

export interface IClientEvents extends ClientEvents {
    loadedSlash: [commands: ChatInputApplicationCommand[], client: InfiniteClient];
    deletedSlash: [client: InfiniteClient]
}

export interface Event<E extends keyof IClientEvents> {
    name?: string;
    event: E;
    type: "on" | "once";
    enabled: boolean;
    run: EventExecute<E>;
};

export interface ChatInputApplicationCommand {
    name: string;
    description: string;
    options: ApplicationCommandOptions[] | undefined[];
    default_permission: boolean | undefined;
}

export interface ApplicationCommandChoices {
    name: string;
    value: string | number;
}

export interface ApplicationCommandOptions {
    type: number;
    name: string;
    description: string;
    required: boolean;
    choices: ApplicationCommandChoices[];
}