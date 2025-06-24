import { Router } from 'express'
import {check} from 'express-validator'
import { registerUser, userLogin } from '../../controllers/auth/loginController.js'
import upload from '../../middlewares/fileUpload.js'

const authRoute = Router()

authRoute.post('/registration',upload.single('image'), 
    [
        check('name').not().isEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email'),
        check('password').isLength({ min: 8 }).withMessage('Password must be atleast 8 character'),
        check('image').custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Image file is required");
            }
            return true;
        }),
        check('role')
            .notEmpty().withMessage('Role is required')
            .isIn(['seller','buyer']).withMessage("Role must be either seller or buyer")
     ]
    ,registerUser)
authRoute.post('/login',
    [
        check('email').isEmail().withMessage('Invalid email'),
        check('password').isLength({ min: 8 }).withMessage('Password must be atleast 8 characters')
    ]
    ,userLogin)

export default authRoute