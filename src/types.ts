import { CommandInteraction, ClientOptions, ReplyMessageOptions, Message } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";

export type SlashCommandExecute = (interaction: CommandInteraction) => Promise<string | ReplyMessageOptions | void> | ReplyMessageOptions | string | void;

export type CommandExecute = (message: Message, args: string[], command: string) => Promise<string | void> | string | void;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description?: string;
    enabled?: boolean;
    execute: SlashCommandExecute;
}

export interface ICommand {
    name: string;
    description?: string;
    enabled?: boolean;
    execute: CommandExecute;
}

export interface EventOptions {
    name?: string;
    event: string;
    type: "on" | "once";
    enabled: boolean;
}

export interface IClientOptions extends ClientOptions {
    useDatabase: boolean,
    databaseType?: DatabaseTypes;
}

export type DatabaseTypes = "json" | "mongo"//| "redis"

export const Command = (cmd: ISlashCommand): ISlashCommand => cmd;

export const Event = (event: EventOptions): EventOptions => event;