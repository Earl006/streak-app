import sql from 'mssql';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { Habit } from '../models/habit';

export class HabitService {
  async getAllHabits(userId: string): Promise<Habit[]> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('userId', sql.UniqueIdentifier, userId)
        .query('SELECT * FROM habits WHERE userId = @userId');
      return result.recordset;
    } finally {
      pool.close();
    }
  }

  async getHabitById(id: string, userId: string): Promise<Habit | null> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('userId', sql.UniqueIdentifier, userId)
        .query('SELECT * FROM habits WHERE id = @id AND userId = @userId');
      return result.recordset[0] || null;
    } finally {
      pool.close();
    }
  }

  async createHabit(habit: Omit<Habit, 'id' | 'currentStreak'>, userId: string): Promise<Habit> {
    const id = uuidv4();
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('userId', sql.UniqueIdentifier, userId)
        .input('habitName', sql.VarChar, habit.habitName)
        .input('habitImage', sql.VarChar, habit.habitImage)
        .input('description', sql.VarChar, habit.description)
        .input('startDate', sql.Date, habit.startDate)
        .query('INSERT INTO habits (id, userId, habitName, habitImage, description, startDate, currentStreak) OUTPUT INSERTED.* VALUES (@id, @userId, @habitName, @habitImage, @description, @startDate, 0)');
      return result.recordset[0];
    } finally {
      pool.close();
    }
  }

  async updateHabit(id: string, startDate: string, userId: string): Promise<Habit | null> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('userId', sql.UniqueIdentifier, userId)
        .input('startDate', sql.Date, startDate)
        .query('UPDATE habits SET startDate = @startDate, currentStreak = 0 OUTPUT INSERTED.* WHERE id = @id AND userId = @userId');
      return result.recordset[0] || null;
    } finally {
      pool.close();
    }
  }

  async deleteHabit(id: string, userId: string): Promise<Habit | null> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('userId', sql.UniqueIdentifier, userId)
        .query('DELETE FROM habits OUTPUT DELETED.* WHERE id = @id AND userId = @userId');
      return result.recordset[0] || null;
    } finally {
      pool.close();
    }
  }
}