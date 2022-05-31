const {Schema, model} = require("mongoose");
const prodSchema = new Schema ({
    prodName : {
        type:String,
        required:true,
        unique:true,
    },
    prodDesc : {
        type:String,
        required:true,
        maxlength:200
    },
    prodImage : {
        type: String,
        required:true,
    },
    prodPrice : {
        type: Number,
        required:true
    },
    prodStock : {
        type: Number,
        required:true
    }
},
{
    timestamps:true
})
const Product = model("Product",prodSchema);
module.exports = Product;