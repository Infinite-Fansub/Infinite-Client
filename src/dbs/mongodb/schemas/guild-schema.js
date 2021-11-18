const mongoose = require('mongoose');

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

const guildSchema = mongoose.Schema({
    _id: reqString,
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
    rectionRoles: Array,
    reactionEmojis: Array,
    ranks: Array
},
    {
        versionKey: false
    });

module.exports = mongoose.model('Guild', guildSchema);