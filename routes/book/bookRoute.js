import { Router } from 'express'
import {
    addBook,
    getAllBook,
    editBook,
    viewBook,
    deleteBook,
    // listSellerBooks,
    // viewSellerBook
} from '../../controllers/book/bookController.js'
import userAuthCheck from '../../middlewares/userAuthCheck.js'
import { check } from 'express-validator'
import upload from '../../middlewares/fileUpload.js'

const bookRoute = Router()

bookRoute.use(userAuthCheck)

bookRoute.post("/addbook",upload.single('image'),
    [
        check("title").notEmpty().withMessage("Title is required"),
        
        check("image").custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Image file is required");
            }
            return true;
        }),
        check("author").notEmpty().withMessage("Author is required"),
        check("price").isFloat({gt:0}).withMessage("Price must be a number greater than 0"),
        check("description").isLength({min: 10}).withMessage("Description must be at least 10 character long"),
        check("stock").isInt({min: 0}).withMessage("Stock must be non-negative integer"),
        check("category").notEmpty().withMessage("Category is required"),
        check("rating").isFloat({min:0,max:5}).withMessage("rating must be between 0 and 5")

    ],
    addBook)
bookRoute.get('/',getAllBook)
bookRoute.patch('/updatebook/:id',upload.single('image'),
    [
        check("title").optional().notEmpty().withMessage("Title cannot be empty"),
        check("image").optional().custom((value, { req }) => {
            if (!req.file) {
                throw new Error("Image file is required");
            }
            return true;
        }),
        
        check("author").optional().notEmpty().withMessage("Author cannot be empty"),
        check("price").optional().isFloat({gt:0}).withMessage("Price must be greater than 0"),
        check("description").optional().isLength({min: 10}).withMessage("Description must be at least 10 character long"),
        check("stock").optional().isInt({min: 0}).withMessage("Stock must be non-negative integer"),
        check("category").optional().notEmpty().withMessage("Category cannot be empty"),
        check("rating").optional().isFloat({min:0, max:5}).withMessage("Rating must be between 0 and 5")
    ]
    ,editBook)
bookRoute.get('/viewbook/:id',viewBook)
bookRoute.patch('/delete/:id',deleteBook)
// bookRoute.get('/sellerbooklist',listSellerBooks)
// bookRoute.get('/sellerviewbook/:id',viewSellerBook)

export default bookRoute