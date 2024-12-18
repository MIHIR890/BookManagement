const { AudioBook } = require('../models/audioBookModel');
 async function newAudioBook(req, res) {
    try {
        const { title, author, description, audioUrl, coverImage, duration } = req.body;
        const audiobook = new AudioBook({ title, author, description, audioUrl, coverImage, duration });
        await audiobook.save();
        res.status(201).json(audiobook);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }

    
 } 
 async function getAudioBook(req, res) {
    try {
        const audiobooks = await AudioBook.find();
        res.status(200).json(audiobooks);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    
 }  
 module.exports = { newAudioBook, getAudioBook };