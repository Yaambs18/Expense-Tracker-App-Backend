const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const filesDowloadedSchema = new Schema({
    fileUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('FilesDownloaded', filesDowloadedSchema);