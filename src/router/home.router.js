import { Router } from "express"
import productModel from "../DAO/model/product.model.js"


const router = Router()
router.get('/', async (req, res) => {

    const products = await productModel.find().lean().exec()
    console.log(products)
 

    isSessionAlive()
    res.render('home', { products })
 
})

export default router;