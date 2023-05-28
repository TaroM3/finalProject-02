import { Router } from "express";

import messageModel from "../DAO/model/message.model.js";

const router = Router()

router.get('/', async(req, res) => {
    const messages = await messageModel.find().lean().exec()
    res.status(200).render('chat', {messages})
})

export default router;