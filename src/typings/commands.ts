import { CommandInteraction, Awaitable, Message } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { InfiniteClient } from "../client";

export type SlashCommandExecute = (interaction: CommandInteraction, client: InfiniteClient) => Awaitable<void>;
export type CommandExecute = (options: CommandArgs) => Awaitable<void>;

export interface ISlashCommand {
    data: Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    description?: string;
    post?: Post;
    enabled?: boolean;
    execute: SlashCommandExecute;
};

export interface ICommand {
    name: string;
    description?: string;
    enabled?: boolean;
    execute: CommandExecute;
};

export interface CommandArgs {
    message: Message, args: string[], command: string, client: InfiniteClient
}

export type Guild = string | string[] | "ALL";
export type Post = "GLOBAL" | Guild;