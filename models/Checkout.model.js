const {Schema, model} = require("mongoose");

const checkoutSchema = new Schema({
  products:
    [{
        product:{
        type: Schema.Types.ObjectId,
        ref: 'Product',
    },
      qty: {
        type: Number,
        default: 0,
      },
      price: {
        type: Number,
        default: 0,
      },
    }],

  user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required : true
    },
  totalQty: {
          type: Number,
          default: 0,
          required: true,
        },
  totalCost: {
          type: Number,
          default: 0,
          required: true,
        },

orderCompleted : {
    type: Boolean,
    required: true
}

});

const Checkout = model("Checkout",checkoutSchema);
module.exports = Checkout;