import express from 'express';
import { HabitController } from '../controllers/habitController';

const router = express.Router();
const habitController = new HabitController();

router.get('/', habitController.getHabits);
router.get('/:id', habitController.getHabit);
router.post('/', habitController.createHabit);
router.patch('/:id', habitController.updateHabit);
router.delete('/:id', habitController.deleteHabit);

export default router;