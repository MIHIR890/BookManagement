const BookCollection = require('../models/bookModel');
const  LogInCollection  = require('../models/userModel');
const FavouriteCollection = require('../models/favouriteBookModel');
//add to favourite
async function addtoFavourites(req, res) {
    try {
        const { bookId, userId } = req.body;
        

        if (!bookId || !userId) {
            return res.status(400).json({
                message: "bookId and userId are required"
            });
        }
        // Check if book exists
        const bookData = await BookCollection.findOne({ bookId });
        if (!bookData) {
            

            return res.status(400).json({
                message: "Book Not Found"
            });
        }

        // Check if user exists
        const userData = await LogInCollection.findOne({ userId: userId });
      
        if (!userData) {
            return res.status(400).json({
                message: "User Not Found"
            });
        }

        // Check if the book is already in the user's favourites
        const existingFavourite = await FavouriteCollection.findOne({ bookId, userId });
        if (existingFavourite) {
            return res.status(200).json({
                message: "Book is already in your favourites"
            });
        }

        // Create a new favourite entry
        const newFavourite = new FavouriteCollection({
            bookId: bookData.bookId,
            userId: userData.userId,
            bookName: bookData.bookName,
            authorName: bookData.authorName,
            coverImage: bookData.coverImage
        });

        // Save the favourite
        await newFavourite.save();

        return res.status(200).json({
            message: "Added to favourites",
            data: {
                bookData,
                userData,
            }
        });
    } catch (err) {
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

//get favourite
async function getfavorite(req, res) {
    try{
        const {  userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                message: "userId are required"
            });
        }
        const favouriteList = await FavouriteCollection.find({userId : userId});
        if(favouriteList.length == 0){
            return res.status(200).json({
                message : "Data not found"
            })
        }
        else{
            return res.status(200).json({
                message : "Favourite list fetched sucessfully",
                data : favouriteList
            })
        }

    }
    catch{
        return res.status(500).json({
            message : "Something went wrong !!"
        })
    }
}

    //remove from lsit

    async function removeFavourite(req, res) {
        try {
            const { bookId , userId } = req.body;
    
            if (!bookId && !userId) {
                return res.status(400).json({
                    message: "Book Id is required"
                });
            }
    
            // Await the result of the deletion
            const deleteBook = await FavouriteCollection.findOneAndDelete({ bookId, userId });
    
            // Check if a book was actually deleted
            if (!deleteBook) {
                return res.status(404).json({
                    message: "Book not found in favourites"
                });
            }
    
            return res.status(200).json({
                message: "Book removed from favourites",
                deletedBook: deleteBook
            });
    
        } catch (err) {
            return res.status(500).json({
                message: "Something went wrong",
                error: err.message
            });
        }
    }
    
    

    


module.exports = { addtoFavourites, getfavorite, removeFavourite} ;
