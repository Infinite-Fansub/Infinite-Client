import { CommandInteraction, ClientOptions, ReplyMessageOptions, Message, ClientEvents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { Color } from "colours.js";
import { InfiniteClient } from ".";

export type SlashCommandExecute = (interaction: CommandInteraction) => Promise<string | ReplyMessageOptions | void> | ReplyMessageOptions | string | void;

export type CommandExecute = (message: Message, args: string[], client: InfiniteClient, command: string) => Promise<string | void> | string | void;

export type EventExecute<E extends keyof IClientEvents> = (...args: IClientEvents[E]) => Promise<IClientEvents | void> | void;

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

export interface IClientEvents extends ClientEvents {
    loadedSlash: [commands: ChatInputApplicationCommand[]]
}

export interface Event<E extends keyof IClientEvents> {
    name?: string;
    event: E;
    type: "on" | "once";
    enabled: boolean;
    run: EventExecute<E>;
};

export interface IClientOptions extends ClientOptions {
    useDatabase: boolean;
    databaseType?: DatabaseTypes;
    dirs?: DirectoryTypes;
    publishCommands?: "global" | "guild" | "both";
};

export interface DirectoryTypes {
    commands?: string;
    slashCommands?: string;
    events?: string;
};

export type DatabaseTypes = MongoType | "json" //"json" | "mongo" | "redis"

export interface MongoType {
    type: "mongo"
    mongoPath: string
};

export interface Emojis {
    emoji?: string;
    errorEmoji?: string;
};

export interface DefaultColors {
    color: Color;
    errorColor: Color;
    gradientPrimary: Color;
    gradientSecondary: Color;
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
export type UserTag = `#${number}`;
export type GuildId = `#${number}` | `${number}`;
export type Guild = GuildId | GuildId[];
export type Post = "GLOBAL" | Guild;