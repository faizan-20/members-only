const express = require('express');
const router = express.Router();

const message_controller = require('../controllers/messageController');
const user_controller = require("../controllers/userController");
const Message = require("../models/message");

/* GET home page. */
router.get('/', async function(req, res, next) {
  const messages = await Message.find().populate("user").exec();

  (req, res, next) => {
    if (!(messages instanceof Array)) {
      if (typeof messages === "undefined") messages = [];
      else messages = new Array(messages);
    }
    next(); 
  }

  res.render('index', { 
    title: 'OnlyMembers', 
    user: req.user,
    messages: messages,
  });
});

router.get('/new-message', message_controller.message_create_get);

router.post('/new-message', message_controller.message_create_post);

router.get('/subscribe', user_controller.subscribe_get);

router.post('/subscribe', user_controller.subscribe_post);

module.exports = router;
