import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import habitRoutes from './routes/habitRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/habits', habitRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});