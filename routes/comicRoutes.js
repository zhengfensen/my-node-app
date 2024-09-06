const express = require('express');
const router = express.Router();
const comicController = require('../controllers/comicController');
const upload = require('../upload');  // 引入上传配置
const {authenticate,authorizeAdmin} = require('../middlewares/authenticate'); // 引入 JWT 认证中间件

// 上传漫画封面图
router.post('/:id/upload-cover',authenticate,authorizeAdmin, upload.single('cover'), comicController.uploadCoverImage);//使用了 upload.single('cover')。这个中间件通常用于处理文件上传的请求，
//获取指定漫画封面
router.get('/:id/get-cover', comicController.getComicCoverById);
// 上传章节图片
router.post('/:comicId/chapters/:chapterId/upload-images',authenticate,authorizeAdmin, upload.array('images'), comicController.uploadChapterImages);

// 获取所有漫画
router.get('/', comicController.getAllComics);

// 获取特定漫画
router.get('/:id',authenticate,authorizeAdmin, comicController.getComicById);

// 创建新漫画
router.post('/',authenticate,authorizeAdmin, comicController.createComic);

// 更新漫画
router.put('/:id', authenticate,authorizeAdmin,comicController.updateComic);

// 删除漫画
router.delete('/:id',authenticate,authorizeAdmin, comicController.deleteComic);

// 获取漫画的章节
router.get('/:id/chapters',authenticate,authorizeAdmin, comicController.getChaptersByComicId);

// 添加章节到漫画
router.post('/:id/chapters',authenticate,authorizeAdmin, comicController.addChapterToComic);

// 获取漫画的标签
router.get('/:id/tags',authenticate,authorizeAdmin, comicController.getTagsByComicId);

// 添加标签到漫画
router.post('/:id/tags', authenticate,authorizeAdmin,comicController.addTagToComic);

module.exports = router;