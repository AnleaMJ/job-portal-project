import express from 'express';
import cors from 'cors';
import scrapeRoute from './routes/scrape.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', scrapeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
