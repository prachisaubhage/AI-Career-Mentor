const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    filename: { type: String },
    originalName: { type: String },
    path: { type: String },
    fileUrl: { type: String },
    mimetype: { type: String },
    size: { type: Number },
    uploadedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const achievementSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Achievement title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: String,
      default: '',
      trim: true,
    },
    type: {
      type: String,
      default: 'General',
      trim: true,
    },
    file: {
      type: fileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const Achievement = mongoose.model('Achievement', achievementSchema);

module.exports = Achievement;
