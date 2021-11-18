const mongoose = require('mongoose');

const reqString = {
    type: String,
    require: true,
};

const num = {
    type: Number,
    default: 0
};

const globalSchema = mongoose.Schema({
    _id: reqString,
    name: reqString,
    reputation: num,
    gifts: num,
    kicks: num,
    bans: num
},
{
    versionKey: false
});

module.exports = mongoose.model('Global', globalSchema);