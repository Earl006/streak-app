import sql from 'mssql';
import pool from '../config/db';
import { Habit } from '../models/habit';

export class HabitService {
  async getAllHabits(): Promise<Habit[]> {
    try {
      await pool.connect();
      const result = await pool.request().query('SELECT * FROM habits');
      return result.recordset;
    } finally {
      pool.close();
    }
  }

  async getHabitById(id: string): Promise<Habit | null> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('SELECT * FROM habits WHERE id = @id');
      return result.recordset[0] || null;
    } finally {
      pool.close();
    }
  }

  async createHabit(habit: Omit<Habit, 'id' | 'currentStreak'>): Promise<Habit> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('habitName', sql.VarChar, habit.habitName)
        .input('habitImage', sql.VarChar, habit.habitImage)
        .input('description', sql.VarChar, habit.description)
        .input('startDate', sql.Date, habit.startDate)
        .query('INSERT INTO habits (habitName, habitImage, description, startDate, currentStreak) OUTPUT INSERTED.* VALUES (@habitName, @habitImage, @description, @startDate, 0)');
      return result.recordset[0];
    } finally {
      pool.close();
    }
  }

  async updateHabit(id: string, startDate: string): Promise<Habit | null> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('startDate', sql.Date, startDate)
        .query('UPDATE habits SET startDate = @startDate, currentStreak = 0 OUTPUT INSERTED.* WHERE id = @id');
      return result.recordset[0] || null;
    } finally {
      pool.close();
    }
  }

  async deleteHabit(id: string): Promise<boolean> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM habits WHERE id = @id');
      return true;
    } finally {
      pool.close();
    }
  }
}