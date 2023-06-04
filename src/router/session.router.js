import { Router, urlencoded } from "express"
import userModel from "../DAO/model/user.model.js"

const router = Router()


// GEt /session/register
router.get('/register', (req, res) => {
    res.render('./session/register')
})

// /session/register POST method
router.post('/register', async(req, res) => {
    const userNew = req.body

    if (userNew.first_name === '' || userNew.last_name === '' || userNew.email === '' || userNew.age === '' || userNew.password === ''){
        return res.status(401).render('./errors/base', {error: 'Your data is required'})
    }
    if( userNew.email == 'adminCoder@coder.com'){
          return res.status(401).render('./errors/base', {error: 'Email\'s already registered.'})
    }

    if(await userModel.findOne({email: userNew.email})){
        return res.status(401).render('./errors/base', {error: 'User\'s already registered.'})
    }

    const user = new userModel.create(userNew)
    await user.save()
    // if()
    res.redirect('./login')
})


//  /session/login GET 
router.get('/login', (req, res) =>{
    // const { username } = req.query
    // if(username == '') return res.send('Username is required.')
    // req.session.user = username
    res.render('./session/login')

})

// /session/login POST
router.post('/login', async(req, res) => {
    const {email, password } = req.body

    if( email == 'adminCoder@coder.com'){
        if(password == 'adminCod3r123'){
            req.session.user = {
                first_name: 'Lautaro',
                last_name: 'Melillo',
                email: 'adminCoder@coder.com',
                age: 29,
                rol: 'admin'
            }
            return res.redirect('/api/products')
        }else{
            return res.status(401).render('./errors/base', {error: 'Error with email or password'})
        }
    }
    const user = await userModel.findOne({ email, password }).lean().exec()
    if(!user){
        return res.status(401).render('./errors/base', {error: 'Error with email or password'})
           
    }
    req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        age: user.age,
        rol: 'user'
    }
    res.redirect('/api/products')
})


router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if(err){
            res.status(500).render('./errors/base', { error: err})
        }else{
            res.redirect('./login')
        }
    })
})

export default router;