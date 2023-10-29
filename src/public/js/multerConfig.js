//multerConfig.js
const multer = require('multer');
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    // Lista de tipos MIME permitidos
    const allowedMimes = ['image/jpeg', 'image/png', 'image/avif', 'image/jpg'];

    if (allowedMimes.includes(file.mimetype)) {
        // Aceptar el archivo
        cb(null, true);
    } else {
        // Rechazar el archivo y establecer el error en el objeto request
        req.fileValidationError = 'Tipo de archivo no válido. Sólo se permiten imágenes .jpg, .png, .jpeg y .avif';
        cb(null, false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter
});

module.exports = upload;
