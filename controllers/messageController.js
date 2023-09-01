const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

const Message = require("../models/message");


exports.message_create_get = asyncHandler(async (req, res, next) => {
    res.render("new_message_form", {
        title: "New Message"
    });
});

exports.message_create_post = [
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("text", "Message must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const message = new Message({
            title: req.body.title,
            timestamp: new Date(),
            user: req.user,
            text: req.body.text,
        });

        if (!errors.isEmpty()) {
            res.render("new_message_form", {
                title: "New Message",
                message: message,
                errors: errors.array(),
            });
            return;
        } else {
            await message.save();
            res.redirect("/");
        }
    })
];