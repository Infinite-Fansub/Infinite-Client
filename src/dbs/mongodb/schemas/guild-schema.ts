import { Document, Schema, model } from "mongoose";
import { Snowflake } from "discord-api-types";

export interface IGuild {
    guildId: Snowflake,
    name: string,
    prefix: string,
    defaultRoleID: Snowflake,
    ignoreChannels: Snowflake[],
    logChannels: Snowflake[],
    welcomeChannel: Snowflake,
    leaveChannel: Snowflake,
    musicChannel: Snowflake,
    bans: number,
    kicks: number,
    mutes: number,
    muteRoleName: string,
    muteRoleID: Snowflake,
    rectionRoles: Object,
    ranks: Snowflake[]
}

export interface IGuildDocument extends IGuild, Document {

}

const guildSchema = new Schema<IGuild>(
    {
        guildId: { type: String, required: true },
        name: { type: String, required: true },
        prefix: { type: String, default: "!" },
        defaultRoleID: String,
        ignoreChannels: Array,
        logChannels: Array,
        welcomeChannel: String,
        leaveChannel: String,
        musicChannel: String,
        bans: { type: Number, default: 0 },
        kicks: { type: Number, default: 0 },
        mutes: { type: Number, default: 0 },
        muteRoleName: String,
        muteRoleID: String,
        rectionRoles: Object,
        ranks: Array
    },
    {
        versionKey: false,
        _id: false
    }
);

export default model<IGuild>("Guild", guildSchema)