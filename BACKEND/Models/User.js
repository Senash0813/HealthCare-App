
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema(
    {
        name:{
            type:String,
            required:true
        },
        number:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        province:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        address:{
            type:String,
            required:true
        },

        description: {
            type: String,
            required: true
        },
        image:{
            type:String,
            required:true
        }
     
       
       
       
        

    }
);
const User = mongoose.model("User",userSchema);
module.exports = User;



