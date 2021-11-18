import { Document, Schema, model } from "mongoose";

export interface IGuild {
    guildId: string,
    name: string,
    prefix: string,
    defaultRoleID: String,
    ignoreChannels: [],
    logChannels: [],
    welcomeChannel: String,
    leaveChannel: String,
    musicChannel: String,
    bans: number,
    kicks: number,
    mutes: number,
    muteRoleName: String,
    muteRoleID: String,
    rectionRoles: Object,
    ranks: []
}

export interface IGuildDocument extends IGuild, Document {

}

const reqString = {
    type: String,
    require: true,
};

const num = {
    type: Number,
    default: 0
};

const pref = {
    type: String,
    default: "!"
};

const guildSchema = new Schema<IGuild>(
    {
        guildId: reqString,
        name: reqString,
        prefix: pref,
        defaultRoleID: String,
        ignoreChannels: Array,
        logChannels: Array,
        welcomeChannel: String,
        leaveChannel: String,
        musicChannel: String,
        bans: num,
        kicks: num,
        mutes: num,
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