const multer = require('multer');
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        files: 5,
        fileSize: 5 * 1024 * 1024,
    },
    fileFilter: (req, file, callback) => {
        if (!file.mimetype.startsWith('image/')) {
            return callback(new Error('Apenas imagens são permitidas.'));

        }

        callback(null, true);
    },
});

module.exports = upload;