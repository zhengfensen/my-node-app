const mongoose = require('mongoose');

const comicSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    coverImage: { type: String },
    description: { type: String },
    chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Chapter' }], // 引用章节
    tags: [{ type: String }] // 直接存储标签的字符串数组
});

const Comic = mongoose.model('Comic', comicSchema);
module.exports = Comic;