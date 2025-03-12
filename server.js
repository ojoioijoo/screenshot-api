const express = require('express');
const { chromium } = require('playwright');

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("API is running.");
});

app.get('/screenshot', async (req, res) => {
  const url = req.query.url;
  const device = req.query.device || 'desktop'; // default: desktop

  if (!url) {
    return res.status(400).json({ error: 'Missing URL parameter' });
  }

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    // Ορίζουμε τις διαστάσεις ανάλογα με τη συσκευή
    if (device === 'mobile') {
      await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
    } else if (device === 'tablet') {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    } else {
      await page.setViewportSize({ width: 1280, height: 800 }); // Desktop
    }

    await page.goto(url, { waitUntil: 'load', timeout: 10000 });
    const screenshot = await page.screenshot();

    await browser.close();
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Error while taking screenshot:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
