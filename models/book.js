import mongoose from "mongoose";

const bookSchema = mongoose.Schema({
    
        title:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        author:{
            type:String,
            required:true
        },
        description:{
            type:String,
            required:true
        },
        price:{
          type:Number,
          required:true, 
        },
        stock:{
            type:Number,
            required:true
        },
        category:{
            type:String,
            required:true,
            enum:["Fiction",
                "Non Fiction",
                "Romance",
                "Mystery & Thriller",
                "Sci-fi","Biography",
                "Children",
                "Fantasy",
                "Comic & Graphics Novels",
                "Business & Economics",
                "Poetry","Others"],
            default:"Others"   
        },
        rating:{
            type:Number,
            min:0,
            max:5,
            default:0
        },
        is_deleted:{
            type:Boolean,
            default:false
        },
        seller:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
         
},{
    timestamps:true
})

const Book = mongoose.model("Book",bookSchema)

export default Book