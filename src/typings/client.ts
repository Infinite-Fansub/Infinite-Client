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

export type DatabaseTypes = MongoType | RedisType | "json"

export interface MongoType {
    type: "mongo"
    path: string
};

export interface RedisType {
    type: "redis"
    path: RedisObject | string
}

export interface RedisObject {
    username: string,
    password: string,
    entrypoint: string,
    port?: string
}