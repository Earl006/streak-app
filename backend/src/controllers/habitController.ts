import { Request, Response } from 'express';
import { HabitService } from '../services/habitService';

const habitService = new HabitService();

export class HabitController {
  async getHabits(req: Request, res: Response) {
    try {
      const habits = await habitService.getAllHabits();
      res.json(habits);
    } catch (error: any) {
      res.status(500).json({ error: 'Error fetching habits', message: error.message});
    }
  }

  async getHabit(req: Request, res: Response) {
    const { id } = req.params;
    try {
      const habit = await habitService.getHabitById(id);
      if (habit) {
        res.json(habit);
      } else {
        res.status(404).json({ error: 'Habit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error fetching habit' });
    }
  }

  async createHabit(req: Request, res: Response) {
    const { habitName, habitImage, description, startDate } = req.body;
    try {
      const newHabit = await habitService.createHabit({ habitName, habitImage, description, startDate });
      res.status(201).json(newHabit);
    } catch (error) {
      res.status(500).json({ error: 'Error creating habit' });
    }
  }

  async updateHabit(req: Request, res: Response) {
    const { id } = req.params;
    const { startDate } = req.body;
    try {
      const updatedHabit = await habitService.updateHabit(id, startDate);
      if (updatedHabit) {
        res.json(updatedHabit);
      } else {
        res.status(404).json({ error: 'Habit not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error updating habit' });
    }
  }
  async deleteHabit(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await habitService.deleteHabit(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Error deleting habit' });
    }
  }
}