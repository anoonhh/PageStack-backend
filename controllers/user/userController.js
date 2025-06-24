import User from '../../models/user.js'
import HttpError from '../../middlewares/httpError.js'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

//view Profile
export const userViewProfile = async (req , res , next) =>{
    try{
        // const id = req.params.id
        const {user_id, user_role} = req.user_data
       

        // if(!mongoose.Types.ObjectId.isValid(id)){
        //     return next(new HttpError("Invalid id", 400))
        // }
        // if( !user_id){
        //      return next(new HttpError("Access denied. ", 403));
        // }

        // else{
            const viewProfile = await User.findById(user_id).select('-password')

            if(!viewProfile){
                return next(new HttpError("User not found",404))
            }

            res.status(200).json({
                status : true,
                data : viewProfile,
                message: null
            })
        // }    
    }
    catch(error){
        return next(new HttpError("Oops.. Something went wrong!", 500))
    }
}


//Edit Profile

export const userEditProfile = async (req,res,next) => {
    try{
        const errors = validationResult(req)

        if(!errors.isEmpty()){
            return next(new HttpError("Invalid input: "+errors.array()[0].msg, 422))
        }else{
            // const id = req.params.id
            const {name , email } = req.body
            const {user_id, user_role} = req.user_data
            // const imagePath =req.file.path

            /////////////////////method 2////////////////////////
            const imagePath = req.file ? req.file.path : undefined
            const updateFields = {
                name,
                email,
                };

                if (imagePath) {
                updateFields.image = imagePath;
                }
//////////////////////////////////////////////////


            /// no need to fetch id from params as token is passed in login
            
            // if(!mongoose.Types.ObjectId.isValid(id)){
            //     return next(new HttpError("Invalid id",400))
            // }

            // if( user_id !== id){
            //     return next(new HttpError("Access denied. You can only edit your own profile.", 403))
            // } 

            const updatedProfile = await User.findOneAndUpdate(
                {_id:user_id},
                // {
                // name: name ,
                // email : email ,
                // image: imagePath 
                // },
                updateFields,         //////as per method 2
                {new: true, runValidators:true}
            ).select('-password')

            if(!updatedProfile){
                return next (new HttpError("Invalid credentials",400))
            } else {

                res.status(200).json({
                    status:true,
                    data: null,
                    message: 'profile updated successfully'
                })
            }
        }
    }
    catch(error){
        return next(new HttpError("Oops! Something went wrong", 500))
    }
}