const mongoose = require('mongoose');

const reqString = {
    type: String,
    require: true,
};

const num = {
    type: Number,
    default: 0
};

const bool = {
    type: Boolean,
    default: false
}

const profileSchema = mongoose.Schema({
    guildID: reqString,
    userID: reqString,
    name: reqString,
    tag: reqString,
    xp: num,
    level: num,
    ignoreRoles: Array,
    roles: Array,
    warns: num,
    isMuted: bool,
    mutedTime: num,
    marriedTo: String
},
{
    versionKey: false
});

module.exports = mongoose.model('Profile', profileSchema);