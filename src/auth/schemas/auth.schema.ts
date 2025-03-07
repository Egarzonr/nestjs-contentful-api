import { Schema, Document, model } from 'mongoose';
import * as bcrypt from 'bcrypt';

export interface User extends Document {
  username: string;
  password: string;
  roles: string[];
  comparePassword: (password: string) => Promise<boolean>;
}

const UserSchema = new Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ['user'] },
});

UserSchema.pre<User>('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = function (this: User, password: string) {
  return bcrypt.compare(password, this.password);
};

export const UserModel = model<User>('User', UserSchema);
