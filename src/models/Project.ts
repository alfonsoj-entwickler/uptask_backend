import mongoose, {
  Schema,
  Document,
  PopulatedDoc,
  Types,
  ObjectId,
} from "mongoose";
import { InterfaceTask } from "./Task";
import { IUser } from "./User";

export interface InterfaceProject extends Document {
  projectName: string;
  clientName: string;
  description: string;
  tasks: PopulatedDoc<InterfaceTask & Document>[];
  manager: PopulatedDoc<IUser & Document>;
}

const ProjectSchema: Schema = new Schema(
  {
    projectName: {
      type: String,
      required: true,
      trim: true,
    },
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    tasks: [
      {
        type: Types.ObjectId,
        ref: "Task",
      },
    ],
    manager: {
      type: Types.ObjectId,
      ref: 'User'
    },
  },
  { timestamps: true },
);

const Project = mongoose.model<InterfaceProject>("Project", ProjectSchema);
export default Project;
