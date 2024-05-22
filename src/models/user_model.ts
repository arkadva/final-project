import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  googleId?: string;
  name: string;
  email: string;
  password?: string;
  profileImg?: string;
  tokens?: string[];
}

const userSchema = new Schema<IUser>({
  googleId: {
    type: String,
    required: false,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: false,
  },
  profileImg: {
    type: String,
    required: false,
  },
  tokens: {
    type: [String],
    required: false,
  },
});

export default mongoose.model<IUser>("User", userSchema);
