const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, required: true },
    family_name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    subscribed: { type: Boolean, required: true, default: false },
})

UserSchema.virtual("name").get(function () {
    let fullname = "";
    if (this.first_name && this.family_name) {
        fullname = `${this.family_name}, ${this.first_name}`;
    }

    return fullname;
});

UserSchema.virtual("url").get(function () {
    return `/home/user/${this._id}`;
});

module.exports = mongoose.model("User", UserSchema);