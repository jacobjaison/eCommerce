const {Schema, model} = require("mongoose");
const catSchema = new Schema ({
    catName : {
        type:String,
        required:true,
        unique:true,
    },
    catDesc : {
        type:String,
        required:true,
        maxlength:200
    },   
},
{
    timestamps:true
})
const Category = model("Category",catSchema);
module.exports = Category;