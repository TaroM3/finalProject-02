import { Router } from "express";
import userModel from "../DAO/model/user.model.js";

const router = Router()

router.get('/register', (req, res) => {
    res.send('session/register')
})

// POST method
router.post('/register', async(req, res) => {
    const userNew = req.body
    const user = await new userModel.create(userNew)
    await user.save()
    res.redirect('/session/login')
})

export default router;