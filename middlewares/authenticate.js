const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/userModel');

// 中间件：JWT 认证
const authenticate = (req, res, next) => {
    // 从请求头中获取 Authorization 字段，并提取 token
    const token = req.headers.authorization?.split(' ')[1];

    // 如果请求头中没有 token，返回 401 未授权错误
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    // 验证 token 的合法性和有效性
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if (err) {
            // 如果 token 无效或过期，返回 401 未授权错误
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // 将解码后的用户 ID 保存到请求对象中，以便后续使用
        req.userId = decoded.userId;
        
        // 根据解码的用户 ID 查找用户信息
        const user = await User.findById(req.userId);
        if (!user) {
            // 如果用户不存在，返回 404 未找到错误
            return res.status(404).json({ message: 'User not found' });
        }

        // 将用户角色保存到请求对象中，以便后续的角色验证
        req.userRole = user.role;
        // 继续执行下一个中间件或路由处理程序
        next();
    });
};

// 中间件：仅允许管理员执行操作
const authorizeAdmin = (req, res, next) => {
    // 检查用户角色是否为 'admin'
    if (req.userRole !== 'admin') {
        // 如果不是管理员，返回 403 禁止访问错误
        return res.status(403).json({ message: 'Forbidden: Admins only' });
    }
    // 如果是管理员，继续执行下一个中间件或路由处理程序
    next();
};

module.exports = { authenticate, authorizeAdmin };