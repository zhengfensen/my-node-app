const Chapter = require('../models/chapterModel');
const Comic = require('../models/comicModel');
const path = require('path');
const { serverUrl } = require('../config');

// 获取所有章节
exports.getChapters = async (req, res) => {
    try {
        const chapters = await Chapter.find();
        res.json(chapters);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 获取单个章节
exports.getChapterById = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            res.json(chapter);
        } else {
            res.status(404).send('Chapter not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 创建新章节
exports.createChapter = async (req, res) => {
    try {
        const newChapter = new Chapter(req.body);
        const chapter = await newChapter.save();
        // 更新漫画的章节列表
        await Comic.findByIdAndUpdate(chapter.comic, { $push: { chapters: chapter._id } });
        res.status(201).json(chapter);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 获取指定章节的全部图片
exports.getChapterImages = async (req, res) => {
    try {
        const chapter = await Chapter.findById(req.params.id);
        if (chapter) {
            const imageUrls = chapter.images.map(image => `${serverUrl}${image.replace(/\\/g, '/')}`);
            res.json({ images: imageUrls });
        } else {
            res.status(404).send('Chapter images not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 更新章节
exports.updateChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (chapter) {
            res.json(chapter);
        } else {
            res.status(404).send('Chapter not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 删除章节
exports.deleteChapter = async (req, res) => {
    try {
        const chapter = await Chapter.findByIdAndDelete(req.params.id);
        if (chapter) {
            // 从漫画中移除该章节
            await Comic.findByIdAndUpdate(chapter.comic, { $pull: { chapters: chapter._id } });
            res.status(204).send();
        } else {
            res.status(404).send('Chapter not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};