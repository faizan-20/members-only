const User = require("../models/user");

const asyncHandler = require("express-async-handler");

exports.subscribe_get = (req, res, next) => {
    res.render("subscribe_form", {subscribed: req.user.subscribed});
};

exports.subscribe_post = asyncHandler(async (req, res, next) => {
    if (req.body.key === "catsarecute") {
        const user = new User ({
            first_name: req.user.first_name,
            family_name: req.user.family_name,
            username: req.user.username,
            password: req.user.password,
            subscribed: true,
            _id: req.user._id,
        });

        await User.findByIdAndUpdate(req.user._id, user, {});
        res.redirect("/");
    } else {
        res.render("subscribe_form", { error: "Wrong Key", subscribed: req.user.subscribed });
    }
})
