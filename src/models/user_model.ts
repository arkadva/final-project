import mongoose from "mongoose";

export interface IUser {
  email: string;
  password: string;
  name: string;
  tokens: String[];
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String],
  }
});

export default mongoose.model<IUser>("User", userSchema);
