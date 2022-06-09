const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema(
  {
    firstName : {
      type: String,
      required: true
    },
    lastName : {
      type : String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required:true,
      lowercase:true,
      trim:true
    },
    password: {
      type: String,
      required: true
    },
    profilePic: String,
    address: [{
      addressLine1 : String,
      addressLine2 : String,
      couResidence : String,
      couCity : String,
      postalCode : String
    }],
    isAdmin: Boolean,   
 },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const User = model("User", userSchema);
module.exports = User;
