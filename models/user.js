import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name:{
            type:String,
            required:true
        },
         email:{
                type:String,
                required:true,
                unique:true,
                lowercase:true,
                trim:true,
            },
        image:{
            type:String,

        },
        password:{
            type:String,
            required:true,
        },
        role:{
            type:String,
            required:true,
            enum:["seller","buyer"]
        }
        },{
            timestamps:true
        }
    
)

const User = mongoose.model('User',userSchema)

export default User