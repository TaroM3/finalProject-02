import passport from "passport";
import userModel from "../DAO/model/user.model.js";
import GithubStrategy from 'passport-github2';
import dotenv from 'dotenv'

dotenv.config()


const initializePassport = () => {
    
    passport.use('github', new GithubStrategy({
        clientID:  process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: 'http://localhost:8080/api/session/githubcallback',
    }, async(accessToken, refreshToken, profile, done) => {
        console.log(profile)
        try {
            const user = await userModel.findOne({ email: profile._json.email })
            if(user) return done(null, user)

            const newUser = await userModel.create({
                first_name: profile._json.name,
                email: profile._json.email
            })
            return done(null, newUser)
        } catch (err) {
            return done('Error to login with Github '+ err)
        }
    }))

    passport.serializeUser( (user, done) => {
        done(null, user._id)
    })

    passport.deserializeUser( async(_id, done) => {
        const user = await userModel.findById(_id)
        done(null, user)
    })
}

export default initializePassport;