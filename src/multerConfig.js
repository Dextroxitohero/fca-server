import multer from 'multer';

// Configuración de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directorio donde se guardarán los archivos
    },
    filename: (req, file, cb) => {

        cb(null, file.originalname); // Nombre original del archivo
    }
});

const upload = multer({ storage });

export default upload;
