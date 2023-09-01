const { DateTime } = require('luxon');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
    title: { type: String, required: true },
    timestamp: { type: Date, required: true },
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User" }
});

MessageSchema.virtual("url").get(function () {
    return `/home/message/${this._id}`;
});

MessageSchema.virtual("timestamp_formatted").get(function () {
    return DateTime.fromJSDate(this.timestamp).toLocaleString(DateTime.DATETIME_SHORT);
})

module.exports = mongoose.model("Message", MessageSchema);