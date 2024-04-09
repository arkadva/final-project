import mongoose, { Schema } from "mongoose";

export interface IPost {
  text: string;
  img: string;
  createdAt: Date;
  owner: mongoose.Schema.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IPost>({
  text: {
    type: String,
    required: true,
  },
  img: {
    type: String,
    required: false, 
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

export default mongoose.model<IPost>("Post", userSchema);
