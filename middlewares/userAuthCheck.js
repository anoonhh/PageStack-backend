import User from "../models/user.js"
import HttpError from "./httpError.js"
import jwt from 'jsonwebtoken'


const userAuthCheck = async (req,res,next) =>{
    if(req.method === 'OPTIONS'){
        return next()
    }

    try{
        const token = req.headers.authorization.split(" ")[1]

        if(!token){
            return next(new HttpError('You must be logged in to access this route',403))
        }else{
            const decodedToken = jwt.verify(token,process.env.JWT_SECRET_KEY)

            const user = await User.findOne({_id:decodedToken.id, role:decodedToken.role})

            if(!user){
                return next(new HttpError('You must be logged in to access this route',403))
            }else{
                req.user_data = {user_id:decodedToken.id, user_role:decodedToken.role}
                next()  
            }
        }
    }
    catch(error){
        return next(new HttpError("Authentication Failed",403))
    }

}


export default userAuthCheck