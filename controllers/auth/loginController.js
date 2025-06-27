import User from '../../models/user.js'
import HttpError from '../../middlewares/httpError.js'
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import { validationResult } from 'express-validator';

//registration

export const registerUser = async (req, res, next) => {
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(new HttpError('Invalid input: '+ errors.array()[0].msg, 422))
        }
        else{
            const {name, email ,password, role} = req.body
            const imagePath = req.file.path
            
                const existingUser =await User.findOne({email:email})

                if(existingUser){
                    return next(new HttpError("Email already in use", 400))
                }
                else{
                    const hashedPassword =await bcrypt.hash(password, 12)

                    const newUser = await new User({
                        name: name,
                        email: email,
                        image: imagePath,
                        password: hashedPassword,
                        role: role
                    }).save()

                    if(! newUser){
                        return next(new HttpError("Failed to create user", 500))
                    }else{

                        const token = jwt.sign(
                            {id:newUser._id, role:newUser.role}, //data 
                            process.env.JWT_SECRET_KEY, //secret key
                            {expiresIn: process.env.JWT_TOKEN_EXPIRY} // expiry
                        )


                        res.status(201).json({
                            status:true,
                            message: "User created successfully",
                            access_token: token,
                            data: 
                            {
                                id:newUser.id,
                                name:newUser.name,
                                email:newUser.email,
                                image:newUser.image,
                                role:newUser.role
                            }
                        })
                    }
                }
            
        }

        
    }
    catch(error){
        console.error("Register Error:", error);
        return next (new HttpError("Registration Failed", 500))
    }
}

///login


export const userLogin = async (req,res,next) => {
    try{
        const errors = validationResult(req)

        

        if(!errors.isEmpty()){
            console.log(errors,"errrr")
                            console.log('Validation error:', errors.array())
            return next(new HttpError("Invalid input: "+ errors.array()[0].msg,422))
        }else{

            const {email, password} = req.body

            const user = await User.findOne({email:email})

                if (!user){
                    return next (new HttpError("Invalid credentials",401))
                } 
                else{
                    const isValidPassword = await bcrypt.compare(password,user.password)

                    if(!isValidPassword){
                        return next(new HttpError("Invalid Password",401))
                    }
                    else{

                        const token = jwt.sign(
                            {id:user._id, role:user.role}, //data 
                            process.env.JWT_SECRET_KEY, //secret key
                            {expiresIn: process.env.JWT_TOKEN_EXPIRY} // expiry
                        )

                        res.status(200).json({
                            status:true,
                            message:"Login Successfull",
                            access_token:token,
                            data:{
                                id:user._id,
                                name:user.name,
                                email:user.email,
                                role:user.role
                            }

                        })
                    }
                }
            
        }
        
    }
    catch(error){
        console.error("Login Error:", error);
        return next(new HttpError("Login failed", 500))
    }
}
