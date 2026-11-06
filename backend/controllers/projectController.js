const Project = require('../models/Project');
const fs = require('fs');

/**
 * Safely delete file from disk
 */
const safeUnlink = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete file at ${filePath}:`, err.message);
    }
  }
};

/**
 * Format uploaded file into schema structure
 */
const formatProjectFile = (file) => ({
  filename: file.filename,
  originalName: file.originalname,
  path: file.path,
  fileUrl: `/uploads/projects/${file.filename}`,
  mimetype: file.mimetype,
  size: file.size,
  uploadedAt: new Date(),
});

/**
 * @desc    Create a new project
 * @route   POST /api/projects
 * @access  Private
 */
const createProject = async (req, res, next) => {
  try {
    const { name, title, description, technologies, techStack, githubUrl, githubLink, liveUrl, liveLink, completionDate } = req.body;
    const finalName = (name || title || '').trim();

    if (!finalName) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    const files = req.files ? req.files.map(formatProjectFile) : [];

    const project = await Project.create({
      userId: req.user._id,
      name: finalName,
      description: description || '',
      technologies: technologies || techStack || '',
      githubUrl: githubUrl || githubLink || '',
      liveUrl: liveUrl || liveLink || '',
      completionDate: completionDate || '',
      files,
    });

    const obj = project.toObject();
    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project,
      ...obj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all projects for current user
 * @route   GET /api/projects
 * @access  Private
 */
const getProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: projects.length,
      projects,
      data: projects,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single project by ID (owner check)
 * @route   GET /api/projects/:id
 * @access  Private
 */
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you are not authorized to view it',
      });
    }

    return res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update project by ID (owner check)
 * @route   PUT /api/projects/:id
 * @access  Private
 */
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you are not authorized to update it',
      });
    }

    const { name, title, description, technologies, techStack, githubUrl, githubLink, liveUrl, liveLink, completionDate } = req.body;

    if (name !== undefined || title !== undefined) project.name = (name || title || '').trim();
    if (description !== undefined) project.description = description;
    if (technologies !== undefined || techStack !== undefined) project.technologies = technologies || techStack;
    if (githubUrl !== undefined || githubLink !== undefined) project.githubUrl = githubUrl || githubLink;
    if (liveUrl !== undefined || liveLink !== undefined) project.liveUrl = liveUrl || liveLink;
    if (completionDate !== undefined) project.completionDate = completionDate;

    // Append newly uploaded files if any
    if (req.files && req.files.length > 0) {
      const newFiles = req.files.map(formatProjectFile);
      project.files.push(...newFiles);
    }

    const updated = await project.save();
    const obj = updated.toObject();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      project: updated,
      ...obj,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete project by ID (owner check)
 * @route   DELETE /api/projects/:id
 * @access  Private
 */
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or you are not authorized to delete it',
      });
    }

    // Clean up files from disk
    if (project.files && project.files.length > 0) {
      project.files.forEach((f) => safeUnlink(f.path));
    }

    await Project.deleteOne({ _id: project._id });

    return res.status(200).json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
