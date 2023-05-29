import e, { Router } from "express";
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
router.post("/:cid/products/:pid", async (req, res) => {
  // try {

  console.log(req.params.cid)
  console.log(req.params.pid)
  let cart = await cartModel
    .findById(req.params.cid);

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
    console.log(result);
    return res
      .status(200)
      .send("Product added to the Cart successfully: \n " + JSON.stringify(cart));
  }
  // } catch (error) {
  //   console.log("Cart or Product does not exist");
  //   res.status(400).send("Cart or Product does not exist");
  // }
});

//DELETE api/carts/:cid/products/:pid delete a product from a cart
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    let cart = await cartModel.findById(req.params.cid)
    try {

      if (await productModel.findById(req.params.pid) !== undefined) {

        let productIndex = cart.products.findIndex((product) => product.product._id.toString() === req.params.pid)
        console.log(productIndex)
        if (productIndex >= 0) {
          let cartUpdated = cart.products.splice(productIndex, 1)
          let result = await cartModel.updateOne({ _id: req.params.cid }, cart)
          console.log(result)
          res.status(200).send(cart)
        } else {
          res.status(400).send('Product has not found in the cart: ' + req.params.cid)
        }
      }
    } catch {
      res.status(400).send('Product: ' + req.params.pid + ' does not exist.')

    }
  } catch {
    res.status(400).send('Cart: ' + req.params.cid + ' does not exist.')
  }
});


//DELETE api/carts/:cid
router.delete("/:cid", async (req, res) => {
  try {
    let cart = await cartModel.findById(req.params.cid)
    let indexStart = 0;
    let arrayLength = cart.products.length
    cart.products.splice(indexStart, arrayLength)
    let result = await cartModel.updateOne({ _id: req.params.cid }, cart)
    res.status(200).send(cart)
  } catch (error) {
    res.status(400).send('Cart: ' + req.params.cid + ' does not exist.')
  }
})

//PUT api/carts/:cid/products/:pid
//req.body
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    let cart = await cartModel.findById(req.params.cid)
    try {
      if (await productModel.findById(req.params.pid) !== undefined) {
        let productIndex = cart.products.findIndex((product) => product.product._id.toString() === req.params.pid)
        console.log(productIndex)
        if (productIndex >= 0) {
          let newQuantity = parseInt(req.body.quantity)
          console.log(newQuantity)
          cart.products[productIndex].quantity = newQuantity;
          console.log(cart.products[productIndex])
          let result = await cartModel.updateOne({ _id: req.params.cid }, cart)
          res.status(200).send(result)
        } else {
          res.status(400).send('Product has not found in the cart: ' + req.params.cid)
        }
      }
    } catch {
      res.status(400).send('Product: ' + req.params.pid + ' does not exist.')
    }
  } catch (error) {
    res.status(400).send('Cart: ' + req.params.cid + ' does not exist.')
  }
})

//PUT api/carts/:cid/products/:pid
router.put('/:cid', async (req, res) => {
  try {
    let cart = await cartModel.findById(req.params.cid)
    console.log(cart)
    let indexStart = 0;
    let arrayLength = cart.products.length
    cart.products.splice(indexStart, arrayLength)
    try {
      let arrayProducts = req.body.products;
      for (let i = 0; i < arrayProducts.length; i++) {
        // console.log(element._id)
        let product = await productModel.findById(arrayProducts[i]._id.toString());
        // console.log({product, quantity: .quantity})
        cart.products.push({ product, quantity: parseInt(arrayProducts[i].quantity) })
        if (i == (arrayProducts.length - 1)) {

          let result = await cartModel.updateOne({ _id: req.params.cid }, cart)
          res.status(200).send(result)

        }
      }
    }
    catch {
      res.status(400).send('Product: ' + req.params.pid + ' does not exist.')
    }
  } catch (error) {
    res.status(400).send('Cart: ' + req.params.cid + ' does not exist.')
  }

})
export default router;
