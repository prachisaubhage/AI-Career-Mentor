const mongoose = require('mongoose');

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    questionId: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      default: 'General',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    selectedAnswer: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    correct: {
      type: Boolean,
      required: true,
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const AptitudeAttempt = mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);

module.exports = AptitudeAttempt;
