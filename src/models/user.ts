import bcrypt from "bcryptjs";
import Debug from "debug";
import mongoose from "mongoose";
import paginatePlugin from "mongoose-paginate";
const debug = Debug("App");

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  role: string;
  compare(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: "A email is required",
    },
    password: {
      type: String,
      required: "A password is required",
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true },
);

userSchema.plugin(paginatePlugin);

userSchema.methods.compare = function(password: string) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre("save", function(next) {
  if (!this.isModified()) {
    return next();
  }

  if ((this as IUser).password) {
    (this as IUser).password = bcrypt.hashSync((this as IUser).password, 10);
    next();
  }
});

const User = mongoose.model<IUser>("user", userSchema, "users");
export default User;
