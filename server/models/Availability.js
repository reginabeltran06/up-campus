import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema(
  {
    personaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Person",
      required: true,
    },
    fecha: {
      type: String,
      required: true,
    },
    motivo: {
      type: String,
      required: true,
      enum: ["vacaciones", "enfermedad", "permiso", "otro"],
    },
    nota: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

availabilitySchema.index({ personaId: 1, fecha: 1 }, { unique: true });

export default mongoose.model("Availability", availabilitySchema);
