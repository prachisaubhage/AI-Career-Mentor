const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: function () {
        return this.fullName || '';
      },
    },
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    mobile: {
      type: String,
      trim: true,
      sparse: true, // Only index if mobile is provided, preventing empty string duplicate key errors
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false, // Never return password in queries by default
    },
    // Academic & Profile Info
    college: {
      type: String,
      default: '',
      trim: true,
    },
    branch: {
      type: String,
      default: '',
      trim: true,
    },
    semester: {
      type: String,
      default: '',
      trim: true,
    },
    cgpa: {
      type: String,
      default: '',
      trim: true,
    },
    backlogs: {
      type: String,
      default: '0',
      trim: true,
    },
    tenthPercentage: {
      type: String,
      default: '',
      trim: true,
    },
    twelfthPercentage: {
      type: String,
      default: '',
      trim: true,
    },
    diplomaPercentage: {
      type: String,
      default: '',
      trim: true,
    },
    // Skills & Ratings
    technicalSkills: {
      type: String,
      default: '',
      trim: true,
    },
    dsaCoding: {
      type: Number,
      default: 0,
    },
    sqlDbms: {
      type: Number,
      default: 0,
    },
    aptitude: {
      type: Number,
      default: 0,
    },
    communication: {
      type: Number,
      default: 0,
    },
    // Career Targets
    targetRole: {
      type: String,
      default: '',
      trim: true,
    },
    careerGoal: {
      type: String,
      default: '',
      trim: true,
    },
    profileLastUpdated: {
      type: Date,
      default: Date.now,
    },
    // Single Current Resume
    resume: {
      filename: { type: String, default: '' },
      originalName: { type: String, default: '' },
      path: { type: String, default: '' },
      fileUrl: { type: String, default: '' },
      size: { type: Number, default: 0 },
      uploadedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Explicitly register in the 'users' collection
const User = mongoose.model('User', userSchema, 'users');

module.exports = User;
