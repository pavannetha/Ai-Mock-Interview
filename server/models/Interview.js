import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  technicalScore: {
    type: Number,
    min: 0,
    max: 10,
    required: true,
  },
  communicationSCore: {
    type: Number,
    min: 0,
    max: 5,
    required: true,
  },
  stack: { type: String },
  difficultyLevel: { type: String },
  weakAreas: [
    {
      type: String,
    },
  ],
  strongAreas: [
    {
      type: String,
    },
  ],
  feedback: {
    type: String,
    required: true,
  },
  conversation: [
    {
      role: { type: String },
      content: { type: String },
    },
  ],
  startedAt: {
    type: Date,
  },
  endedAt: {
    type: Date,
  },
});

export const Interview = mongoose.model("Interview", interviewSchema);
