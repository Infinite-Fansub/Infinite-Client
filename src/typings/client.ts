import { ClientOptions } from "discord.js"

export interface IClientOptions extends ClientOptions {
    useDatabase: boolean;
    databaseType?: DatabaseTypes;
    dirs?: DirectoryTypes;
};

export interface DirectoryTypes {
    commands?: string | undefined;
    slashCommands?: string | undefined;
    events?: string | undefined;
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