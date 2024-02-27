import mongoose, { Schema, model } from "mongoose";

interface OTPInterface {
	type: "verify-account" | "reset-password";
  userId: string;
  number: string;
  createdAt: Date
}

const otpCodeSchema: Schema = new mongoose.Schema<OTPInterface>(
  {
    type: {
      type: String,
      required: [true, "please, enter the otp type"],
      default: "verify-account",
      trim: true
    },
    userId: {
      type: String,
      required: [true, "please, enter the user id of the otp code"],
      trim: true
    },
    number: {
      type: String,
      required: [true, "please, enter the number"],
    },
    createdAt: {
      type: Date, 
      expires: 3600, 
      index: true,
      default: Date.now
    }
  }
)

export default mongoose.model<OTPInterface>("OTP", otpCodeSchema)
