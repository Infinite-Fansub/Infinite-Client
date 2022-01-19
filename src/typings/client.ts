import { ClientOptions } from "discord.js"

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