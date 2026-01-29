import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    prompt: {
      type: String,
      required: true
    },
    starterCode: {
      type: String,
      required: true
    },
    tests: {
      type: [String], // raw JS test strings
      required: true
    },
    targetMisconceptions: {
      type: [String],
      enum: [
        "missing_return",
        "off_by_one",
        "conditional_reasoning",
        "array_method_misuse",
        "state_mutation",
        "async_misuse",
        "execution_order",
        "trial_and_error"
      ],
      required: true
    }
  },
  { timestamps: false }
);

export default mongoose.model("Question", QuestionSchema);
