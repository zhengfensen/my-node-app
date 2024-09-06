const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');
const User = require('../models/userModel'); // 假设你的 User 模型路径为 '../models/userModel'
const { body, validationResult } = require('express-validator');//导入数据验证模块


// 创建用户的示例方法
exports.createUser = async (req, res) => {
    try {
        res.send('hello wolrd');
        // 使用 express-validator 来验证输入
        // 验证用户名是否为空
        await body('username').notEmpty().withMessage('Username is required').run(req);
        // 验证邮箱是否符合格式且长度至少为 6 个字符
        await body('email').isEmail().withMessage('Invalid email format').run(req);
        // 验证密码是否符合格式且长度至少为 6 个字符
        await body('password').isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').run(req);

        // 获取所有验证结果
        const errors = validationResult(req);
        // 如果有验证错误，返回错误信息
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // 从请求体中提取用户名、邮箱和密码
        const { username, email, password } = req.body;
        // 对密码进行哈希处理以增加安全性
        const hashedPassword = await bcrypt.hash(password, 10);
        // 创建新的用户对象，并保存到数据库
        const newUser = new User({ username, email, password: hashedPassword});
        await newUser.save();
        // 返回成功响应，包含新创建的用户数据
        res.status(201).json(newUser);
    } catch (error) {
        // 捕获和处理异常，返回错误信息
        res.status(500).json({ error: error.message });
    }
};
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Received email:', email);
        console.log('Received password:', password);
        
        const user = await User.findOne({ email });
        console.log('Found user:', user);

        if (user && await bcrypt.compare(password, user.password)) {
            console.log('Password match');
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '24h' }); // 1小时有效期
            return res.json({ token });
        } else {
            console.log('Invalid credentials');
            return res.status(401).send('Invalid credentials');
        }
    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// 获取所有用户
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 获取单个用户
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 更新用户信息
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (user) {
            res.json(user);
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 删除用户
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.status(204).send('User has been deleted');
        } else {
            res.status(404).send('User not found');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};