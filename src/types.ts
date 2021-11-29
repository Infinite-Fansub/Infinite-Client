import { CommandInteraction, ClientOptions, ReplyMessageOptions, Message, ClientEvents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Color } from "colours.js";

export type SlashCommandExecute = (interaction: CommandInteraction) => Promise<string | ReplyMessageOptions | void> | ReplyMessageOptions | string | void;

export type CommandExecute = (message: Message, args: string[], command: string) => Promise<string | void> | string | void;

export type EventExecute<E extends keyof ClientEvents> = (...args: ClientEvents[E]) => Promise<ClientEvents | void> | void;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description?: string;
    enabled?: boolean;
    execute: SlashCommandExecute;
};

export interface ICommand {
    name: string;
    description?: string;
    enabled?: boolean;
    execute: CommandExecute;
};

export interface Event<E extends keyof ClientEvents> {
    name?: string;
    event: E;
    type: "on" | "once";
    enabled: boolean;
    run: EventExecute<E>;
};

export interface IClientOptions extends ClientOptions {
    useDatabase: boolean,
    databaseType?: DatabaseTypes;
    dirs?: DirectoryTypes;
    publishCommands?: "global" | "guild" | "both"
};

export interface DirectoryTypes {
    commands?: string,
    slashCommands?: string,
    events?: string
};

export type DatabaseTypes = "json" | "mongo";//| "redis"

export interface Emojis {
    emoji?: string,
    errorEmoji?: string
}

export interface DefaultColors {
    color: Color,
    errorColor: Color,
    gradientPrimary: Color,
    gradientSecondary: Color
}

export type UserTag = `#${number}`;