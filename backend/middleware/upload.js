const multer = require('multer');
const storage = multer.memoryStorage();
const imageType = require('image-type');

const tiposPermitidos = new Set([
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif'
]);

const upload = multer({
    storage, limits: {
        files: 5,
        sileSize: 5 * 1024 * 1024,
        fields: 10,
        parts: 15,
        fieldSize: 10 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (!tiposPermitidos.has(file.mimetype)) {
            return callback(
                new Error('Formato não permitido. Envie JPEG, PNG, WebP ou GIF.')
            );
        }

        callback(null, true);
    }
});

upload.validarConteudo = (req, res, next) => {
    for (const arquivo of req.files || []) {
        const tipoDetectado = imageType(arquivo.buffer);

        if (
            !tipoDetectado ||
            !tiposPermitidos.has(tipoDetectado.mime) ||
            tipoDetectado.mime !== arquivo.mimetype
        ) {
            return res.status(400).json({
                erro: `O arquivo "${arquivo.originalname}" não possui um formato de imagem válido.`
            });
        }
    }

    next();
}; 

module.exports = upload;