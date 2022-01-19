import { Document, Schema, model, Model } from "mongoose";
import { Snowflake } from "discord-api-types";
import { UserTag } from "../../../typings/index";

export interface IUser {
    guildId: Snowflake,
    userId: Snowflake,
    name: string,
    tag: UserTag,
    xp: number,
    level: number,
    ignoreRoles: Object,
    roles: [],
    warns: number,
    isMuted: boolean,
    mutedTime: number,
    marriedTo: Snowflake
}

export interface IUserDocument extends IUser, Document {

}

export interface IUserModel extends Model<IUserDocument> {
    getProfile: (this: IUserModel, guildId: Snowflake, userId: Snowflake) => Promise<any>
    updateProfile: (this: IUserModel, options: IUser) => Promise<any>
    updateXp: (this: IUserModel, guildId: Snowflake, userId: Snowflake, xp: number) => Promise<any>
    updateLevel: (this: IUserModel, guildId: Snowflake, userId: Snowflake, level: number) => Promise<any>
}

const profileSchema = new Schema<IUserDocument, IUserModel>(
    {
        guildId: { type: String, required: true },
        userId: { type: String, required: true },
        name: { type: String, required: true },
        tag: { type: String, required: true },
        xp: { type: Number, default: 0 },
        level: { type: Number, default: 0 },
        ignoreRoles: Array,
        roles: Array,
        warns: { type: Number, default: 0 },
        isMuted: { type: Boolean, default: false },
        mutedTime: { type: Number, default: 0 },
        marriedTo: String
    },
    {
        versionKey: false
    }
);

export default model<IUserDocument, IUserModel>('Profile', profileSchema);