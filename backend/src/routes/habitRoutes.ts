import express from 'express';
import { HabitController } from '../controllers/habitController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();
const habitController = new HabitController();



router.get('/',authMiddleware, habitController.getHabits);
router.get('/:id',authMiddleware, habitController.getHabit);
router.post('/',authMiddleware, habitController.createHabit);
router.patch('/:id',authMiddleware, habitController.updateHabit);
router.delete('/:id',authMiddleware, habitController.deleteHabit);

export default router;