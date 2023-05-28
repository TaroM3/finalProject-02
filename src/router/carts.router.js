import { Router } from "express";
import cartModel from "../DAO/model/cart.model.js";
import productModel from "../DAO/model/product.model.js";

const router = Router();

//GET /api/carts/:cid
router.get("/:cid", async (req, res) => {
  try {
    let cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product");
    res.status(200).send(cart);
  } catch (error) {
    console.log(error);
    res.status(400).send("Cart does not exist.");
  }
});

//POST /api/carts/
router.post("/", async (req, res) => {
  try {
    await cartModel.create({
      product: {},
    });

    res.status(200).send("A cart has been created.");
  } catch (error) {
    res.status(400).send("Cart has not been created.");
  }
});

//POST /api/carts/:cid/product/:pid
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cart = await cartModel
      .findById(req.params.cid)
      .populate("products.product");

    let product = await productModel.findById(req.params.pid);
    let productExist = cart.products.findIndex(
      (product) => product.product._id.toString() === req.params.pid
    );
    if (productExist >= 0) {
      cart.products[productExist].quantity++;
      let result = await cartModel.updateOne({ _id: req.params.cid }, cart);
      // console.log(productExist)
      let cartUpdated = await cartModel
        .findById(req.params.cid)
        .lean()
        .exec();
      return res.status(200).send(cartUpdated);
    } else {
      cart.products.push({ product, quantity: 1 });
      let result = await cartModel.updateOne({ _id: req.params.cid }, cart);
      console.log(cartUpdated);
      return res
        .status(200)
        .send("Product added to the Cart successfully: \n " + cartUpdated);
    }
  } catch (error) {
    console.log("Cart or Product does not exist");
    res.status(400).send("Cart or Product does not exist");
  }
});

export default router;
