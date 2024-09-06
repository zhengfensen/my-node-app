const serverUrl = 'https://jingman.men/';
module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-key', // 从环境变量中读取，或者使用默认值
    serverUrl, // 这里将 serverUrl 一并导出
    // 其他配置项
    
};