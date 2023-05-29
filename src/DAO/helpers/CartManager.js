import cartModel from "../model/cart.model.js";
import productModel from "../model/product.model.js"


export default class CartManager{
    constructor(){
        this.MY_CART_ID = '646c2259b8a4904918a9f087'
    }

    addProductToMyCart = async(_id) =>{
        let product = await productModel.findById(_id);
        let cart = await cartModel.findById(this.MY_CART_ID)
        let productExist = cart.products.findIndex((product) => product.product._id.toString() === _id);

        if(productExist >= 0){
            cart.products[productExist].quantity++;
            let result = await cartModel.updateOne({_id: this.MY_CART_ID}, cart)
            let cartUpdated = await cartModel.findById(this.MY_CART_ID).lean().exec();
            console.log(result)
        }else{
            cart.products.push({product, quantity: 1})
            let result = await cartModel.updateOne({_id: this.MY_CART_ID}, cart)
            console.log(result)
        }


    }



}