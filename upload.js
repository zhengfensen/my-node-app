const multer = require('multer');
const path = require('path');
const unzipper = require('unzipper');
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

// 设置文件存储路径和文件名
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');// 存储路径为 'uploads/'  ,cb是callback的缩写
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);    // 文件名是时间戳加原始扩展名
        const fileName = `${Date.now()}${ext}`;
    cb(null, fileName.replace(/\\/g, '/')); // 替换反斜杠
    }
});

const upload = multer({ storage: storage  ,limits: { fileSize: 10 * 1024 * 1024, files: 300 } // 文件大小限制为10MB，总文件数限制为300
    });

module.exports = upload;


// 上传 ZIP 文件的控制器
exports.uploadZipFile = async (req, res) => {
    try {
        // 保存上传的 ZIP 文件
        const zipFilePath = path.join('uploads', req.file.filename);

        // 解压 ZIP 文件
        await pipeline(
            fs.createReadStream(zipFilePath),
            unzipper.Extract({ path: 'uploads/' })
        );

        // 删除 ZIP 文件
        fs.unlinkSync(zipFilePath);

        res.json({ message: 'ZIP file uploaded and extracted successfully' });
    } catch (error) {
        res.status(500).send(error.message);
    }
};