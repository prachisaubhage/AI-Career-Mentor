const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directory exists
const ensureDirExists = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Generic storage creator
const createStorage = (subfolder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(__dirname, '..', 'uploads', subfolder);
      ensureDirExists(uploadPath);
      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const ext = path.extname(sanitizedName);
      const base = path.basename(sanitizedName, ext);
      cb(null, `${base}-${uniqueSuffix}${ext}`);
    },
  });
};

// Disallowed executable extensions
const disallowedExtensions = ['.exe', '.sh', '.bat', '.cmd', '.js', '.py', '.php', '.pl', '.cgi', '.jar', '.vbs', '.msi'];

// File filter factory
const createFileFilter = (allowedExtensions) => {
  return (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // Explicit security check against executables
    if (disallowedExtensions.includes(ext)) {
      return cb(new Error(`File type ${ext} is not allowed for security reasons`), false);
    }

    if (allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file format: ${ext}. Allowed formats: ${allowedExtensions.join(', ')}`
        ),
        false
      );
    }
  };
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

// Resume Uploader (PDF, DOC, DOCX)
const resumeUpload = multer({
  storage: createStorage('resumes'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: createFileFilter(['.pdf', '.doc', '.docx']),
});

// Projects Uploader (PDF, PPT, PPTX, ZIP, JPG, JPEG, PNG)
const projectUpload = multer({
  storage: createStorage('projects'),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB for project zips/reports
  fileFilter: createFileFilter(['.pdf', '.ppt', '.pptx', '.zip', '.jpg', '.jpeg', '.png']),
});

// Certifications Uploader (PDF, JPG, JPEG, PNG)
const certificationUpload = multer({
  storage: createStorage('certifications'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: createFileFilter(['.pdf', '.jpg', '.jpeg', '.png']),
});

// Internships Uploader (PDF, JPG, JPEG, PNG, DOC, DOCX)
const internshipUpload = multer({
  storage: createStorage('internships'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: createFileFilter(['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx']),
});

// Achievements Uploader (PDF, JPG, JPEG, PNG)
const achievementUpload = multer({
  storage: createStorage('achievements'),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: createFileFilter(['.pdf', '.jpg', '.jpeg', '.png']),
});

module.exports = {
  resumeUpload,
  projectUpload,
  certificationUpload,
  internshipUpload,
  achievementUpload,
};
