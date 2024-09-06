const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const comicRoutes = require('./routes/comicRoutes');
const chapterRoutes = require('./routes/chapterRoutes');
const path = require('path'); // 导入 path 模块
const cors = require('cors');
const fs = require('fs'); // 导入 fs 模块
const https = require('https'); // 导入 https 模块
const http = require('http'); // 导入 http 模块
require('dotenv').config();
const config = require('./config'); // 导入配置文件
const app = express();
const httpsport = process.env.PORT || 3000;
const httpPort = 80; // 为 HTTP 服务器设置端口
app.use(cors()); // 允许所有域名的跨域请求
const hostname = process.env.HOSTNAME || '::'; // 使用环境变量设置主机名，默认值为所有 IPv6 地址

// 连接到 MongoDB

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.use(bodyParser.json());//解析json格式请求
app.use(bodyParser.urlencoded({ extended: true }));//解析url类型请求
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/users', userRoutes);
app.use('/comics', comicRoutes);
app.use('/chapters', chapterRoutes);
app.get("/",(req,res)=>{res.json("hello world");
  console.log("hello world");
});
// HTTPS 配置
const options = {
  key: fs.readFileSync('C:/letsencrypt/privkey.pem'),
  cert: fs.readFileSync('C:/letsencrypt/fullchain.pem')
};
//app.listen(port,hostname, () => {
 // console.log(`Server is running on http://localhost:${port}`);
//  console.log(`Server is running on http://[${config.serverUrl.split('[')[1].split(']')[0]}]:${port}`);
//});
https.createServer(options, app).listen(httpsport, '::', () => {
  console.log(`Server is running on https://localhost:${httpsport}`);
});
// 启动 HTTP 服务器
http.createServer(app).listen(httpPort, '::', () => {
  console.log(`Server is running on http://localhost:${httpPort}`);
});