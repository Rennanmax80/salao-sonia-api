const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Função auxiliar para criar pastas
const ensureDirExists = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
};

// Cria storage dinâmico por pasta
const createStorage = (folder = '') => {
  const uploadPath = path.join('uploads', folder);
  ensureDirExists(uploadPath);

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9) + ext;
      cb(null, uniqueName);
    }
  });
};

// Filtro de arquivos
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  if (allowedMimes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Formato não suportado'), false);
};

// Função geradora do middleware
function getUploader(folder = '') {
  const storage = createStorage(folder);
  const upload = multer({ storage, fileFilter, limits: { fileSize: 2 * 1024 * 1024 } });

  return {
    single: (fieldName) => upload.single(fieldName),
    array: (fieldName, maxCount = 5) => upload.array(fieldName, maxCount),
    fields: (fieldsConfig) => upload.fields(fieldsConfig),
    any: () => upload.any(),
  };
}

module.exports = getUploader; // <-- exporta como função para require()
