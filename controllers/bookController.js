const { messaging } = require('firebase-admin');
const BookCollection = require('../models/bookModel');
const CategoryCollection = require('../models/categoryModel');
const crypto = require('crypto');


// Generate a unique book ID

let bookCounter = 0; // Counter to track the number of books (in-memory storage)


async function generateBookId() {
    // Generate a random 16-byte value and convert it to a hexadecimal string
    const randomId = crypto.randomBytes(8).toString('hex'); // 16 characters long
    return `book_id_${randomId}`;
}

// add books based on category
async function addBooks(req, res) {
    try {
        // Generate the next book ID
        const bookId = await generateBookId();

        // Destructure book details from request body
        const { categoryId, bookName, authorName, coverImage } = req.body;

        // Validate that all required fields are provided
        if (!categoryId || !bookName || !authorName) {
            return res.status(400).json({ message: "All details are required" });
        }

        // Check if the category exists
        const existingCategory = await CategoryCollection.findOne({ id : categoryId });
        if (!existingCategory) {
            return res.status(400).json({ message: "Category not found ", data : {categoryId} });
            
        }
        const existingBook = await BookCollection.findOne({bookName , authorName});

        if (existingBook) {
            return res.status(400).json({ message: "Book  already added ", data : {categoryId} });
            
        }

        // Create a new book object and save it to the database
        const newBook = new BookCollection({
            bookId,
            categoryId,
            bookName,
            authorName,
            coverImage // Optional: Only include if present
        });

        await newBook.save();

        // Return a success response
        return res.status(200).json({
            message: "Book added successfully",
            data: {
                bookId,
                categoryId,
                bookName,
                authorName,
                coverImage
            }
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ message: 'Error saving book data', error: error.message });
    }
}

//get bookList based on category
async function getBookList(req, res) {
    try{

        const { categoryId } = req.body;
        console.log(categoryId);

        if(!categoryId){
            res.status(400).json({
                message :"Category Id is required"
            })
        }
        const fetchBooks = await BookCollection.find({categoryId});

        if(fetchBooks.length != 0){
            return res.status(200).json({
                message: "Books list are fetched",
                data : fetchBooks
            })
        }
        else{
            return res.status(200).json({
                message : "Books not found"
            });
        }
    }
    catch{
        return res.status(500).json({
            message : "Error in fetching books"
        })
    }
    
}

module.exports = { addBooks , getBookList} ;
