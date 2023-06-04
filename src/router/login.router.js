import { Router } from "express"
import userModel from "../DAO/model/user.model.js"

const router = Router()

//  /session/login GET 
router.get('/', (req, res) =>{
    const { username } = req.query
    if(username == '') return res.send('Username is required.')
    req.session.user = username
    res.render('./session/login')

})

// /session/login POST
router.post('/', async(req, res) => {
    const {email, password } = req.body
    const user = await userModel.findOne({ email, password }).lean().exec()
    if(!user){
        return res.status(401).render('error/base', {error: 'Error with email or password'})
           
    }
    req.session.user = user
    res.redirect('/products')
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            res.status(500).render('error/base', { error: err})
        }else{
            res.redirect('/session/login')
        }
    })
})

export default router;

