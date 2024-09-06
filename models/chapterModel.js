const mongoose = require('mongoose');

const chapterSchema = new mongoose.Schema({
    title: { type: String, required: true },
    images: [{ type: String,required:true }]
});

const Chapter = mongoose.model('Chapter', chapterSchema);
module.exports = Chapter;