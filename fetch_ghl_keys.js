const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log("Navigating to GHL form...");
    await page.goto('https://api.leadconnectorhq.com/widget/form/b7iMLSrRiqy0UkVyoRu3', { waitUntil: 'networkidle0' });

    console.log("Extracting inputs...");
    const fields = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea'));
        return inputs.map(input => {
            // Find the closest label or wrapper to get the text
            const wrapper = input.closest('.form-builder--item');
            const labelText = wrapper ? wrapper.innerText.trim().split('\n')[0] : 'Unknown';
            return {
                name: input.name,
                id: input.id,
                placeholder: input.placeholder,
                type: input.type,
                inferredLabel: labelText
            };
        });
    });

    fs.writeFileSync('ghl_fields.json', JSON.stringify(fields, null, 2));
    console.log("Fields written to ghl_fields.json");

    await browser.close();
})();
