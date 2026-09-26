const Certification = require('../models/Certification');
const fs = require('fs');

const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err.message);
    }
  }
};

const formatCertFile = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  path: file.path,
  fileUrl: `/uploads/certifications/${file.filename}`,
  mimetype: file.mimetype,
  size: file.size,
  uploadedAt: new Date(),
});

/**
 * @desc    Create a certification
 * @route   POST /api/certifications
 * @access  Private
 */
const createCertification = async (req, res, next) => {
  try {
    const { name, issuer, issueDate, credentialId, credentialUrl } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Certification name is required',
      });
    }

    const certificateFile = req.file ? formatCertFile(req.file) : {};

    const certification = await Certification.create({
      userId: req.user._id,
      name: name.trim(),
      issuer: issuer || '',
      issueDate: issueDate || '',
      credentialId: credentialId || '',
      credentialUrl: credentialUrl || '',
      certificateFile,
    });

    return res.status(201).json({
      success: true,
      message: 'Certification added successfully',
      certification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all certifications for user
 * @route   GET /api/certifications
 * @access  Private
 */
const getCertifications = async (req, res, next) => {
  try {
    const certifications = await Certification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: certifications.length,
      certifications,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single certification by ID
 * @route   GET /api/certifications/:id
 * @access  Private
 */
const getCertificationById = async (req, res, next) => {
  try {
    const certification = await Certification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      certification,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update certification by ID
 * @route   PUT /api/certifications/:id
 * @access  Private
 */
const updateCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or unauthorized',
      });
    }

    const { name, issuer, issueDate, credentialId, credentialUrl } = req.body;

    if (name !== undefined) certification.name = name.trim();
    if (issuer !== undefined) certification.issuer = issuer;
    if (issueDate !== undefined) certification.issueDate = issueDate;
    if (credentialId !== undefined) certification.credentialId = credentialId;
    if (credentialUrl !== undefined) certification.credentialUrl = credentialUrl;

    // If new file uploaded, remove old file and update
    if (req.file) {
      if (certification.certificateFile && certification.certificateFile.path) {
        safeUnlink(certification.certificateFile.path);
      }
      certification.certificateFile = formatCertFile(req.file);
    }

    const updated = await certification.save();

    return res.status(200).json({
      success: true,
      message: 'Certification updated successfully',
      certification: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete certification by ID
 * @route   DELETE /api/certifications/:id
 * @access  Private
 */
const deleteCertification = async (req, res, next) => {
  try {
    const certification = await Certification.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found or unauthorized',
      });
    }

    if (certification.certificateFile && certification.certificateFile.path) {
      safeUnlink(certification.certificateFile.path);
    }

    await Certification.deleteOne({ _id: certification._id });

    return res.status(200).json({
      success: true,
      message: 'Certification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCertification,
  getCertifications,
  getCertificationById,
  updateCertification,
  deleteCertification,
};
