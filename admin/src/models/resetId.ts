import mongoose, { Schema } from "mongoose";

interface ResetIdInterface {
	partOne: string;
	partTwo: string;
	partThree: string;
	createdAt: Date;
}

const resetIdSchema: Schema = new mongoose.Schema<ResetIdInterface>(
	{
		partOne: {
      type: String,
      require: [true, 'please enter the part1'],
      trim: true,
    },
    partTwo: {
      type: String,
      require: [true, 'please enter the part2'],
      trim: true,
    },
    partThree: {
      type: String,
      require: [true, 'please enter the part3'],
      trim: true,
    },
    createdAt: {
      type: Date, 
      expires: 3600, 
      index: true,
      default: Date.now
    }
	}
);

const User = mongoose.model<ResetIdInterface>("ResetId", resetIdSchema);

export default User;
