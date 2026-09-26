const Internship = require('../models/Internship');
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

const formatInternshipFile = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  path: file.path,
  fileUrl: `/uploads/internships/${file.filename}`,
  mimetype: file.mimetype,
  size: file.size,
  uploadedAt: new Date(),
});

/**
 * @desc    Create a new internship
 * @route   POST /api/internships
 * @access  Private
 */
const createInternship = async (req, res, next) => {
  try {
    const { company, role, domain, startDate, endDate, duration, description, skillsLearned } = req.body;

    if (!company || !company.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Company name is required',
      });
    }

    const files = req.files ? req.files.map(formatInternshipFile) : [];

    const internship = await Internship.create({
      userId: req.user._id,
      company: company.trim(),
      role: role || '',
      domain: domain || '',
      startDate: startDate || '',
      endDate: endDate || '',
      duration: duration || '',
      description: description || '',
      skillsLearned: skillsLearned || '',
      files,
    });

    return res.status(201).json({
      success: true,
      message: 'Internship added successfully',
      internship,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all internships for user
 * @route   GET /api/internships
 * @access  Private
 */
const getInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: internships.length,
      internships,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single internship by ID
 * @route   GET /api/internships/:id
 * @access  Private
 */
const getInternshipById = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or unauthorized',
      });
    }

    return res.status(200).json({
      success: true,
      internship,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update internship by ID
 * @route   PUT /api/internships/:id
 * @access  Private
 */
const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or unauthorized',
      });
    }

    const { company, role, domain, startDate, endDate, duration, description, skillsLearned } = req.body;

    if (company !== undefined) internship.company = company.trim();
    if (role !== undefined) internship.role = role;
    if (domain !== undefined) internship.domain = domain;
    if (startDate !== undefined) internship.startDate = startDate;
    if (endDate !== undefined) internship.endDate = endDate;
    if (duration !== undefined) internship.duration = duration;
    if (description !== undefined) internship.description = description;
    if (skillsLearned !== undefined) internship.skillsLearned = skillsLearned;

    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(formatInternshipFile);
      internship.files.push(...newFiles);
    }

    const updated = await internship.save();

    return res.status(200).json({
      success: true,
      message: 'Internship updated successfully',
      internship: updated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete internship by ID
 * @route   DELETE /api/internships/:id
 * @access  Private
 */
const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found or unauthorized',
      });
    }

    if (internship.files && internship.files.length > 0) {
      internship.files.forEach((f) => safeUnlink(f.path));
    }

    await Internship.deleteOne({ _id: internship._id });

    return res.status(200).json({
      success: true,
      message: 'Internship deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInternship,
  getInternships,
  getInternshipById,
  updateInternship,
  deleteInternship,
};
