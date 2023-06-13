import { Router, urlencoded } from "express"
import userModel from "../DAO/model/user.model.js"
import passport from "passport"
import { createHash, isValidPassword } from "../utils.js"

const router = Router()


// GEt /session/register
router.get('/register', (req, res) => {
    res.render('./session/register')
})

// /session/register POST method
router.post('/register', async (req, res) => {
    let password = String (req.body.password)
    let userNew = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        password: createHash(password)
    }

    if (userNew.first_name === undefined || userNew.last_name === undefined || userNew.email === undefined || userNew.age === undefined || userNew.password === undefined) {
        console.log('20')
        return res.status(401).render('./errors/base', { error: 'Your data is required' })
    }
    if (userNew.email === 'adminCoder@coder.com') {
        console.log('23')
        return res.status(401).render('./errors/base', { error: 'Email\'s already registered.' })
    }

    if (await userModel.findOne({ email: userNew.email })) {
        console.log('26')
        return res.status(401).render('./errors/base', { error: 'User\'s already registered.' })
    }

    const user = await userModel.create(userNew)
    await user.save()
    // if()
    console.log('35')
    res.redirect('./login')
})


//  /session/login GET 
router.get('/login', (req, res) => {
    // const { username } = req.query
    // if(username == '') return res.send('Username is required.')
    // req.session.user = username
    res.render('./session/login')

})

// /session/login POST
router.post('/login', async (req, res) => {
    const { email, password } = req.body

    if (email == 'adminCoder@coder.com') {
        if (password == 'adminCod3r123') {
            req.session.user = {
                first_name: 'Lautaro',
                last_name: 'Melillo',
                email: 'adminCoder@coder.com',
                age: 29,
                rol: 'admin'
            }
            return res.redirect('/api/products')
        } else {
            return res.status(401).render('./errors/base', { error: 'Error with email or password' })
        }
    }
    const user = await userModel.findOne({ email }).lean().exec()
    if (!user) {
        return res.status(401).render('./errors/base', { error: 'User has not found.' })
    }

    if(!isValidPassword(user, password)){
        return res.status(403).json({ status: 'error', error: 'Incorrect password.'})
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
        if (err) {
            console.log('85')
            res.status(500).render('./errors/base', { error: err })
        } else {
            console.log('88')
            res.redirect('./login')
        }
    })
})


router.get('/github', passport.authenticate('github', { scope: ['user: email'] }), (req, res) => { })

router.get('/githubcallback', passport.authenticate('github', { failureRedirect: './login' }), async (req, res, user) => {
    req.session.user = user
    res.redirect('/api/products')
})

export default router;