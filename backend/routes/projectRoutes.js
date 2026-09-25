const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/authMiddleware');
const { projectUpload } = require('../middleware/uploadMiddleware');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(projectUpload.array('files', 10), createProject);

router.route('/:id')
  .get(getProjectById)
  .put(projectUpload.array('files', 10), updateProject)
  .delete(deleteProject);

module.exports = router;
