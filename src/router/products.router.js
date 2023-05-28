import { Router } from "express";
import productModel from "../DAO/model/product.model.js";
import ProductManager from "../DAO/helpers/productManager.js";

const router = Router();
// GET  /api/products[?:limit=N][?:sort=][?page=n][?query=string]
// query -> sort -> page -> limit //
router.get("/", async (req, res) => {
  // let page = parseInt(req.query.page);
  // let limit = parseInt(req.query.limit);
  // // const sort = req.query.sort;
  // const sortQueryParam = req.query.sort;
  let { limit, page, sort, query } = req.query
//   let val = (req.query.sort.match( 'asc'))? 'asc' : 'desc';
// console.log(val)
  const productManager = new ProductManager()
  const result = await productManager.productPaginate(sort, parseInt(page), parseInt(limit), query.valueOf()) 
    
  res.render('products', {result})
  // console.log(result.payload)
  // const SORT_VALUES = {
  //   asc: { price: 1 },
  //   desc: { price: -1 },
  //   default: {},
  // };
  // res.render('products', {result})
  // // if (sortQueryParam === "asc") SORT_VALUES["asc"];
  // // if (sortQueryParam === "desc") SORT_VALUES["desc"];

  // const sort = (String(req.query.sort) === 'asc') ? SORT_VALUES['asc'] : SORT_VALUES['desc']
  // //   console.log(sortValidation)
  // console.log(sort);

  // console.log(sort)
  // if(sort === "asc" || sort === "desc"){

  // }
  // let query = {
  //   category: req.query.category,
  //   avaibility: req.query.avaibility,
  // };

  // if (query.category !== null) {
  // }
  // if (!page) page = 1;
  // if (!limit) limit = 3;

  // let options = {
  //   sort: sort,
  //   page: page,
  //   limit: limit,
  //   lean: true,
  // };
  // if (req.query.query !== null) {
  // const products = await productModel.paginate({}, options);
  // console.log(products);
  // const result = {
  //   status: "success",
  //   payload: products.docs,
  //   totalPages: products.totalPages,
  //   prevPage: products.prevPage,
  //   nextPage: products.nextPage,
  //   page: products.page,
    // hasPrevPage
  // };
  // }
  // let limit = req.query.limit;
  // if (limit !== undefined) {
  //   let productArray = await productModel.find().limit(limit).lean().exec();
  //   return res.send(productArray);
  // } else {
  //   let productArray = await productModel.find().lean().exec();
  //   return res.send(productArray);
  // }
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
