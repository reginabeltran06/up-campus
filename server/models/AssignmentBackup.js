import mongoose from "mongoose";

const AssignmentBackupSchema = new mongoose.Schema({
  fecha: {
    type: String,
    required: true,
  },
  assignments: [
    {
      personaId: {
        type: String,
        required: true,
      },
      zonaId: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("AssignmentBackup", AssignmentBackupSchema);
