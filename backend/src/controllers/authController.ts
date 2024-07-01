import { Request, Response } from 'express';
import { AuthService } from '../services/authService';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const { username, email, password } = req.body;
    try {
      const user = await authService.registerUser(username, email, password);
      res.status(201).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error registering user' });
    }
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await authService.loginUser(email, password);
      if (token) {
        res.json({ token });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error logging in' });
    }
  }
}