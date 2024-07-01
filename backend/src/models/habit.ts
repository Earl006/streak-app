export interface Habit {
  id: string;
  userId: string;
  habitName: string;
  habitImage: string;
  description: string;
  startDate: string;
  currentStreak: number;
}