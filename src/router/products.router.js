import { Router } from "express";
import productModel from "../DAO/model/product.model.js";
import ProductManager from "../DAO/helpers/productManager.js";

const router = Router();
// GET  /api/products[?:limit=N][?:sort=][?page=n][?query=string]
// query -> sort -> page -> limit //
//----------- to change: method productPaginate() -----------------// 
router.get("/", async (req, res) => {


  let { limit, page, sort, query } = req.query

  if (!limit) limit = 3;
  
  if (!page) page = 1;

  if(!sort) sort = 'default'

  if(!query) query = 'true'
//   let val = (req.query.sort.match( 'asc'))? 'asc' : 'desc';
// console.log(val)
  const productManager = new ProductManager()
  const result = await productManager.productPaginate(sort, parseInt(page), parseInt(limit), query.valueOf()) 
  
  const user = req.session.user
  res.render('products', {result, user})

});

// GET 	/api/products/:pid
router.get("/:pid", async (req, res) => {
  try {
    let product = await productModel.findById(req.params.pid).lean().exec();
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send("Product does not exist.");
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    let productAdded = await productModel.create({ ...req.body });

    res.status(200).send("Product has been added: \n" + productAdded);
  } catch (error) {
    console.log(error);
    res.status(400).send("Product couldnt be added.");
  }
});

// PUT /api/products/:pid
router.put("/:pid", async (req, res) => {
  const productUpdated = req.body;
  try {
    await productModel.updateOne(
      { _id: req.params.pid },
      { ...productUpdated }
    );
    res.status(200).send("Product updated successfully.");
  } catch (error) {
    res.status(400).send("Product couldnt be updated.");
  }
});

// DELETE /api/products/:pid
router.delete("/:pid", async (req, res) => {
  try {
    await productModel.deleteOne({ _id: req.params.pid });

    let id = req.params.pid;
    console.log("Product " + id + " has been deleted.");
    res.status(200).send("Product " + id + " has been deleted.");
  } catch (error) {
    res.status(400).send("Product could not found.");
  }
});

export default router;
