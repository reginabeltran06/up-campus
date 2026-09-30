import express from 'express';
import Person from '../models/Person.js';

const router = express.Router();

// GET /api/persons - Obtener todas las personas
router.get('/', async (req, res) => {
  try {
    const persons = await Person.find().lean();
    res.json(persons);
  } catch (error) {
    console.error('Error fetching persons:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/persons/:id - Obtener una persona
router.get('/:id', async (req, res) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ error: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    console.error('Error fetching person:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
