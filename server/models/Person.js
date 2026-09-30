import mongoose from 'mongoose';

const childSchema = new mongoose.Schema({
  nombre: String,
  edad: Number,
});

const personSchema = new mongoose.Schema(
  {
    nombre: String,
    fechaNacimiento: String,
    telefono: String,
    correo: String,
    fechaIngreso: String,
    casado: Boolean,
    hijos: [childSchema],
    foto: String,
    turno: String,
  },
  { timestamps: true }
);

export default mongoose.model('Person', personSchema, 'CAU');
