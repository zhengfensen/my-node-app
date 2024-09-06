const ComicModel = require('../models/comicModel');
const ChapterModel = require('../models/chapterModel');
const path = require('path');
const { serverUrl } = require('../config');

// 上传漫画封面图
exports.uploadCoverImage = async (req, res) => {
    try {
        const comic = await ComicModel.findById(req.params.id);
        if (!comic) {
            return res.status(404).send('Comic not found');
        }
        comic.coverImage = req.file.path; // 保存封面图路径
        await comic.save();
        res.json({ message: 'Cover image uploaded successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};
// 获取指定漫画封面
exports.getComicCoverById = async (req, res) => {
    try {
        const comic = await ComicModel.findById(req.params.id);
        if (comic) {
            const coverUrl = comic.coverImage.replace(/\\/g, '/');  // 替换反斜杠
            const coverUrlWithServer = `${serverUrl}/${coverUrl}`;
            res.json({ coverImage: coverUrlWithServer });
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
// 上传章节图片
exports.uploadChapterImages = async (req, res) => {
    try {
        const chapter = await ChapterModel.findById(req.params.chapterId);
        if (!chapter) {
            return res.status(404).send('Chapter not found');
        }
        chapter.images = req.files.map(file => file.path); // 保存章节图路径
        await chapter.save();
        res.json({ message: 'Chapter images uploaded successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 获取所有漫画
exports.getAllComics = async (req, res) => {
    try {
        const comics = await ComicModel.find();
        res.json(comics);
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 获取特定漫画
exports.getComicById = async (req, res) => {
    try {
        const comic = await ComicModel.findById(req.params.id).populate('chapters');
        if (comic) {
            res.json(comic);
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 创建新漫画
exports.createComic = async (req, res) => {
    try {
        const comic = new ComicModel(req.body); 
        await comic.save();
        res.status(201).json(comic);
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// 更新漫画
exports.updateComic = async (req, res) => {
    try {
        const comic = await ComicModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (comic) {
            res.json(comic);
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// 删除漫画
exports.deleteComic = async (req, res) => {
    try {
        const comic = await ComicModel.findByIdAndDelete(req.params.id);
        if (comic) {
            res.json({ message: 'Comic deleted' });
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 获取漫画的章节
exports.getChaptersByComicId = async (req, res) => {
    try {
        const comic = await ComicModel.findById(req.params.id).populate('chapters');
        if (comic) {
            res.json(comic.chapters);
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

// 添加章节到漫画
exports.addChapterToComic = async (req, res) => {
    try {
        const chapter = new ChapterModel(req.body);
        await chapter.save();

        const comic = await ComicModel.findById(req.params.id);
        if (comic) {
            comic.chapters.push(chapter._id);
            await comic.save();
            res.status(201).json(chapter);
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// 添加标签到漫画
exports.addTagToComic = async (req, res) => {
    try {
        const { tags } = req.body; // 假设 tags 是一个字符串数组
        const comic = await ComicModel.findById(req.params.id);
        if (comic) {
            // 检查每个标签是否已经存在，如果不存在则添加
            tags.forEach(tag => {
                if (!comic.tags.includes(tag)) {
                    comic.tags.push(tag);
                }
            });
            await comic.save();
            res.status(201).json(comic.tags);
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
};

// 获取漫画的标签
exports.getTagsByComicId = async (req, res) => {
    try {
        const comic = await ComicModel.findById(req.params.id);
        if (comic) {
            res.json(comic.tags);  // 直接返回 tags 数组
        } else {
            res.status(404).send('Comic not found');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};