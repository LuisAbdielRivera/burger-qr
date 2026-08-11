const multer = require('multer');

function errorMiddleware(error, req, res, next) {
  console.error(error);

  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'La imagen no puede superar los 5 MB',
      });
    }

    return res.status(400).json({
      error: 'Error al procesar la imagen',
    });
  }

  if (error?.message === 'Solo se permiten imágenes JPG, PNG o WEBP') {
    return res.status(400).json({ error: error.message });
  }

  return res.status(500).json({
    error: 'Error interno del servidor',
  });
}

module.exports = errorMiddleware;
