const { Builder, By, until } = require('selenium-webdriver');
const assert = require('assert');

describe('UI smoke', function() {
    this.timeout(30000);
    let driver;

    before(async () => {
        driver = await new Builder()
            .usingServer(process.env.SELENIUM_REMOTE || 'http://localhost:4444/wd/hub')
            .forBrowser('chrome')
            .build();
    });

    after(async () => {
        if (driver) await driver.quit();
    });

    it('should show hello message', async () => {
        const appUrl = process.env.APP_URL || 'http://host.docker.internal:8080/';
        await driver.get(appUrl);
        const h1 = await driver.findElement(By.css('h1'));
        const text = await h1.getText();
        assert.ok(text.includes('Hello from Softwareplus'));
    });
});