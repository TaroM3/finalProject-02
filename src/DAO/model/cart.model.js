import mongoose from "mongoose";

const cartSchema = mongoose.Schema({
    products: {
        type: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'products',
                },
                quantity: Number
            }
        ],
        default: [],
        _id:false
    },
})
cartSchema.pre('findById', function(){
    this.populate('products.product');
  })
const cartModel = mongoose.model('carts', cartSchema);

export default cartModel;