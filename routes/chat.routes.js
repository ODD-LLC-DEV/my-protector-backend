const { Router } = require("express");
const {
	getChatMessagesForCustomer,
	getChatsForProtector,
	getChatMessagesForProtector,
} = require("../controllers/chat.controllers");

const router = Router();

router.get("/", getChatsForProtector);

router.get("/:id/messages", getChatMessagesForProtector);

router.get("/messages/:protector_id", getChatMessagesForCustomer);

module.exports = router;
