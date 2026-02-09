import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    },
    attemptNumber: {
      type: Number,
      required: true
    },
    code: {
      type: String,
      required: true
    },
    timeSpent: {
      type: Number, // ms
      required: true
    },
    executionErrors: {
      syntax: [String],
      runtime: [String],
      testFailures: [
        {
          test: String,
          error: String
        }
      ]
    },
    features: {
      type: Object, // raw extracted features
      required: true
    },
    detectedMisconceptions: {
      type: [
        {
          id: String,
          evidence: String,
          confidence: Number
        }
      ],
      required: true
    },
    outcome: {
      type: String,
      enum: ["solved", "abandoned", "attempted"],
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Submission", SubmissionSchema);
