const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const {authenticate,authorizeAdmin} = require('../middlewares/authenticate'); // 引入 JWT 认证中间件
// 注册新用户
router.post('/register', userController.createUser);

// 用户登录
router.post('/login', userController.loginUser);

// 获取所有用户
router.get('/',userController.getAllUsers); // 需要认证才能访问

// 获取单个用户
router.get('/:id',userController.getUserById); // 需要认证才能访问

// 更新用户信息
router.put('/:id',userController.updateUser); // 需要认证才能访问

// 删除用户
router.delete('/:id',userController.deleteUser); // 需要认证才能访问

module.exports = router;