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

const certificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Certification name is required'],
      trim: true,
    },
    issuer: {
      type: String,
      default: '',
      trim: true,
    },
    issueDate: {
      type: String,
      default: '',
      trim: true,
    },
    credentialId: {
      type: String,
      default: '',
      trim: true,
    },
    credentialUrl: {
      type: String,
      default: '',
      trim: true,
    },
    certificateFile: {
      type: fileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

const Certification = mongoose.model('Certification', certificationSchema);

module.exports = Certification;
