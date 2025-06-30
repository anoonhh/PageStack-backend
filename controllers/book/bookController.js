import Book from '../../models/book.js'
import HttpError from '../../middlewares/httpError.js'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'


//add book -> seller
export const addBook = async (req,res,next) =>{
    try{
        const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(new HttpError("Validation Error: " + errors.array()[0].msg, 422));
            }
            else{
                const {title, author, description, price, stock, category, rating} = req.body
                const imagePath = req.file.path
                
                const {user_id: sellerId, user_role: tokenRole} = req.user_data

                if( tokenRole !== "seller"){
                    return next(new HttpError('You are not a seller', 403))
                }
                else{
            
                    const newBook = await new Book
                    ({ 
                        title,
                        image:imagePath,
                        author,
                        description,
                        price,
                        stock,
                        category,
                        rating,
                        seller:sellerId
                        
                    }).save()

                    if(!newBook){
                        return next(new HttpError("Oops! Book is not added", 400))
                    }else{
                        res.status(201).json({
                            status:true,
                            message:"Book added successfully",
                            data:newBook
                        } )
                    }

                 }
            }
         
        }
        catch(error){
            // console.error("Add Book Error:", error); 
            return next(new HttpError("Oops! Something went wrong", 500))
        }
}


// edit book->seller

export const editBook = async (req, res, next) =>{
    try{
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return next(new HttpError("Validation Error: " + errors.array()[0].msg, 422));
        }
        else{
            const id = req.params.id
            const {title,  author, description, price, stock, category, rating} = req.body

            //data from middleware
            const {user_id: sellerId, user_role: tokenRole} = req.user_data

            if ( tokenRole !== "seller") {
                return next(new HttpError("Access denied. Only sellers can perform this action.", 403));
            }
            else{

                const imagePath = req.file ? req.file.path : null

                const update = {
                title : title ,
                author: author ,
                description: description ,
                price: price ,
                stock: stock,
                category: category ,
                rating: rating 
                }

                if(imagePath){
                    update.image = imagePath
                }
                
                const updatedBook = await Book.findOneAndUpdate(
                    {_id:id,seller:sellerId, is_deleted:false},
                    update,
                    {new: true}
                )
                
                if(!updatedBook){
                    return next(new HttpError("Oops! Book is not updated", 400))
                }
                else{
                    res.status(200).json({
                        status:true,
                        message:"Book updated successfully",
                        data:updatedBook
                    })
                }
                
            }

        }    
    }catch(error){
        console.error("Edit Book Error:", error);
        return next(new HttpError("Oops! Something went wrong", 500))
    }
}


///delete book
export const deleteBook = async (req, res, next) =>{
    try{
        const id = req.params.id

        const {user_id : sellerId, user_role: tokenRole} = req.user_data

        if(tokenRole !== "seller"){
            return next(new HttpError("Access denied. Only sellers can perform this action."))
        } 
        else{
            const deleted  = await Book.findOneAndUpdate(
                {_id:id,seller: sellerId, is_deleted:false},
                {is_deleted:true},
                {new:true}
            )

            if(!deleted){
                return next(new HttpError("Book not found", 404))
            }
            else{
                res.status(200).json({
                    status:true,
                    message:"Book deleted successfully",
                    data:null
                })
            }
        }
    }
    catch(error){
        return next(new HttpError("Oops! Something went wrong", 500))
    }
}


//view single book -> buyer / seller

export const viewBook = async (req, res, next) => {
    try{
        const {user_id:sellerId, user_role: tokenRole} = req.user_data
        const id = req.params.id

        let book = []

        if ( tokenRole === "seller"){

            book = await Book.findOne({_id:id,seller:sellerId, is_deleted:false})
            .populate({
                path: 'seller',
                select: 'name'
            })
        }
        else{
           
            book = await Book.findOne({_id: id ,is_deleted:false})
            .populate({
                path: 'seller',
                select: 'name '
            })
        }

        if(!book){
            return next(new HttpError("This book does not exist",404))
        }
        else{
            res.json({
                status:true,
                message:null,
                data:book
            })
        } 
    }catch(error){
        return next (new HttpError("Oops! Something went wrong", 500))
    }
}


// view all book - buyer

export const getAllBook = async (req,res,next) => {
    try{

        let bookList = []
        let total = 0
        const { user_id: sellerId, user_role: tokenRole} = req.user_data

        //pagination
        const limit = parseInt(req.query.limit) || 4;
        const skip = parseInt(req.query.skip) || 0

        if( tokenRole === "seller"){
            bookList =await Book.find({is_deleted: false , seller: sellerId})
            .populate({
                path: 'seller',
                select: 'name '
            })
            //pagination
            .skip(skip)
            .limit(limit)

            total = await Book.countDocuments({is_deleted : false , seller: sellerId})
        }
        else{

             bookList = await Book.find({is_deleted:false})
            .populate({
                path: "seller",
                select: "name"
            })
            .skip(skip)
            .limit(limit)

            total = await Book.countDocuments({is_deleted: false})
        }
        ///if there is no book added by seller no need to show error
        if(bookList){
            res.status(200).json({
                status: true,
                data:bookList,
                total : total,
                message: null
            })
        }
    }catch(error){
        return next(new HttpError("Oops! Something went wrong", 500))
    }
}
