import { Router } from 'express'
import { userEditProfile, userViewProfile } from '../../controllers/user/userController.js'
import userAuthCheck from '../../middlewares/userAuthCheck.js'
import {check} from 'express-validator'
import upload from '../../middlewares/fileUpload.js'

const userRoute = Router()

userRoute.use(userAuthCheck)

userRoute.get('/viewprofile',userViewProfile)
userRoute.patch('/editprofile', upload.single('image'),
    [
       check('name').optional().notEmpty().withMessage('Name is required'),
       check('email').optional().isEmail().withMessage('Invalid email format'),
       check('image').optional().isURL().withMessage('Image must valid URL')
    ],
    userEditProfile)

export default userRoute