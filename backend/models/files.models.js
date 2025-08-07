import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: [true, "Path is required"],
    },
    originalname: {
      type: String,
      required: [true, "Originalname is required"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "User is required"],
    },
    size: {
      type: Number,
      default: 0,
    },
    mimetype: {
      type: String,
      default: null,
    },
    cloudStorageUrl: {
      type: String,
      default: null,
    },
    cloudStorageObject: {
      type: String,
      default: null,
    },
    isGoogleCloudStorage: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const file = mongoose.model("file", fileSchema);

export default file;
