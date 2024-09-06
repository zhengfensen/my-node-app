const express = require('express');
const router = express.Router();
const chapterController = require('../controllers/chapterController');
const {authenticate,authorizeAdmin} = require('../middlewares/authenticate'); // 引入 JWT 认证中间件
// 获取所有章节
router.get('/',chapterController.getChapters);

// 获取单个章节
router.get('/:id',authenticate,authorizeAdmin, chapterController.getChapterById);

//获取某个章节的全部图片
router.get('/:id/images',chapterController.getChapterImages);

// 创建新章节
router.post('/',authenticate,authorizeAdmin, chapterController.createChapter);

// 更新章节
router.put('/:id',authenticate,authorizeAdmin, chapterController.updateChapter);

// 删除章节
router.delete('/:id',authenticate,authorizeAdmin, chapterController.deleteChapter);

module.exports = router;