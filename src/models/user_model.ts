import mongoose from "mongoose";

export interface IUser {
  name: string;
  _id: string;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  _id: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IUser>("User", userSchema);
