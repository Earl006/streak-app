import sql from 'mssql';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import pool from '../config/db';
import { User } from '../models/user';

export class AuthService {
  async registerUser(username: string, email: string, password: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();
    
    try {
      await pool.connect();
      const result = await pool.request()
        .input('id', sql.UniqueIdentifier, id)
        .input('username', sql.VarChar, username)
        .input('email', sql.VarChar, email)
        .input('password', sql.VarChar, hashedPassword)
        .query('INSERT INTO users (id, username, email, password) OUTPUT INSERTED.* VALUES (@id, @username, @email, @password)');
      
      const user = result.recordset[0];
      delete user.password;
      return user;
    } finally {
      pool.close();
    }
  }

  async loginUser(email: string, password: string): Promise<string | null> {
    try {
      await pool.connect();
      const result = await pool.request()
        .input('email', sql.VarChar, email)
        .query('SELECT * FROM users WHERE email = @email');
      
      const user = result.recordset[0];
      if (!user) return null;

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return null;

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
      return token;
    } finally {
      pool.close();
    }
  }
}