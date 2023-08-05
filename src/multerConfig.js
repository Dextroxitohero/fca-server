import multer from 'multer';
import path from 'path';

// Configurar el almacenamiento de archivos con Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/images');
  },
  filename: function (req, file, cb) {
    // Utiliza el correo electrónico como nombre del archivo
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const userId = req.body.id;
    const fileName = `${userId}-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// Crear el middleware Multer con la configuración de almacenamiento
export const upload = multer({ storage: storage });