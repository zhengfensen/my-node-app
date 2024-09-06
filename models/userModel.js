const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String},
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default:'user'}  // 添加角色字段，默认是 'user
    // 其他字段...
});

const User = mongoose.model('User', userSchema);
module.exports = User;