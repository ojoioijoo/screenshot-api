const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
    const url = req.query.url;
    const device = req.query.device || "desktop"; // default: desktop

    if (!url) {
        return res.status(400).json({ error: "Missing URL parameter" });
    }

    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        // Ορίζουμε τις διαστάσεις ανάλογα με τη συσκευή
        if (device === "mobile") {
            await page.setViewportSize({ width: 375, height: 812 }); // iPhone X
        } else if (device === "tablet") {
            await page.setViewportSize({ width: 768, height: 1024 }); // iPad
        } else {
            await page.setViewportSize({ width: 1280, height: 800 }); // Desktop
        }

        await page.goto(url, { waitUntil: "load", timeout: 10000 });

        // Παίρνουμε το screenshot και το αποθηκεύουμε τοπικά
        const screenshot = await page.screenshot();
        const screenshotPath = path.join(__dirname, "screenshot.png"); // Όνομα αρχείου και διαδρομή

        // Αποθήκευση τοπικά
        fs.writeFileSync(screenshotPath, screenshot);
        console.log("Screenshot saved to:", screenshotPath);

        await browser.close();
        res.status(200).send("Screenshot saved to screenshot.png");
    } catch (error) {
        console.error("Error while taking screenshot:", error);
        res.status(500).json({ error: "Something went wrong." });
    }
};
