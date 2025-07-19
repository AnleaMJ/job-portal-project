import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const router = express.Router();

const scrapeGoogleJobs = async (isInternship) => {
  const jobs = [];
  const url = 'https://careers.google.com/jobs/results/';

  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    $('.gc-card').each((_, el) => {
      const title = $(el).find('.gc-card__title').text();
      const location = $(el).find('.gc-job-tags__location').text();
      const href = $(el).find('a').attr('href');

      if (/data|ml|ai|machine learning/i.test(title)) {
        if (isInternship && !/intern/i.test(title)) return;
        jobs.push({
          title,
          company: 'Google',
          location,
          url: `https://careers.google.com${href}`,
          experience: /intern/i.test(title) ? 'Entry' : 'Varied'
        });
      }
    });
  } catch (e) {
    console.error('Google scraping failed:', e.message);
  }

  return jobs;
};

router.post('/scrape', async (req, res) => {
  const { companies = [], internship = false } = req.body;
  let results = [];

  if (companies.includes('Google')) {
    results = results.concat(await scrapeGoogleJobs(internship));
  }

  res.json(results);
});

export default router;
