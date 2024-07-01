import { Response } from 'express';
import { HabitService } from '../services/habitService';
import { AuthRequest } from '../middleware/authMiddleware';

const habitService = new HabitService();

export class HabitController {
  async getHabits(req: AuthRequest, res: Response) {
    try {
      const habits = await habitService.getAllHabits(req.userId!);
      res.json(habits);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching habits' });
    }
  }

  async getHabit(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const habit = await habitService.getHabitById(id, req.userId!);
      if (habit) {
        res.json(habit);
      } else {
        res.status(404).json({ error: 'Habit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching habit' });
    }
  }

  async createHabit(req: AuthRequest, res: Response) {
    const { habitName, habitImage, description, startDate } = req.body;
    try {
      const newHabit = await habitService.createHabit({
        habitName, habitImage, description, startDate,
        userId: ''
      }, req.userId!);
      res.status(201).json(newHabit);
    } catch (error) {
      res.status(500).json({ error: 'Error creating habit' });
    }
  }

  async updateHabit(req: AuthRequest, res: Response) {
    const { id } = req.params;
    const { startDate } = req.body;
    try {
      const updatedHabit = await habitService.updateHabit(id, startDate, req.userId!);
      if (updatedHabit) {
        res.json(updatedHabit);
      } else {
        res.status(404).json({ error: 'Habit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating habit' });
    }
  }

  async deleteHabit(req: AuthRequest, res: Response) {
    const { id } = req.params;
    try {
      const deletedHabit = await habitService.deleteHabit(id, req.userId!);
      if (deletedHabit) {
        res.json(deletedHabit);
      } else {
        res.status(404).json({ error: 'Habit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error deleting habit' });
    }
  }
}