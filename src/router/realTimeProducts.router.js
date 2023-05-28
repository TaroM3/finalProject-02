import { Router } from "express";
import productModel from "../DAO/model/product.model.js";

const router = Router();

router.get('/', async(req, res) => {

    const product = await productModel.find().lean().exec();

    res.status(200).render('realTimeProducts', {product})
})

export default router;