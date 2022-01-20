import { CommandInteraction, ReplyMessageOptions, Message } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { GuildId } from "./general";
import { InfiniteClient } from "../client";

export type SlashCommandExecute = (interaction: CommandInteraction, client: InfiniteClient) => Promise<string | ReplyMessageOptions | void> | ReplyMessageOptions | string | void;
export type CommandExecute = (options: CommandArgs) => Promise<string | void> | string | void;

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

export type Guild = GuildId | GuildId[] | "ALL";
export type Post = "GLOBAL" | Guild;