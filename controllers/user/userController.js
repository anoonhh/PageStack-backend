import User from '../../models/user.js'
import HttpError from '../../middlewares/httpError.js'
import mongoose from 'mongoose'
import { validationResult } from 'express-validator'

//view Profile
export const userViewProfile = async (req , res , next) =>{
    try{
        const {user_id, user_role} = req.user_data

        const viewProfile = await User.findById(user_id).select('-password')

        if(!viewProfile){
            return next(new HttpError("User not found",404))
        }

        res.status(200).json({
            status : true,
            data : viewProfile,
            message: null
        })
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
        }
        else{
            const {name , email } = req.body
            const {user_id, user_role} = req.user_data

            const imagePath = req.file ? req.file.path : null

            const existingUser =await User.findOne({ _id: { $ne: user_id }, email:email})

            if(existingUser){
                return next(new HttpError("Email already in use...", 403))
            } else {

                const updateFields = {
                    name,
                    email,
                    };
    
                if (imagePath) {
                updateFields.image = imagePath;
                }
    
                const updatedProfile = await User.findOneAndUpdate(
                    {_id:user_id},
                    updateFields,        
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
    }
    catch(error){
        return next(new HttpError("Oops! Something went wrong", 500))
    }
}