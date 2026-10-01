const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI Integration Tests', function () {
  // Docker ඇතුළේ slowness එක නිසා timeout එක තත්පර 60 දක්වා වැඩි කර ඇත
  this.timeout(60000);

  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    const gridUrl = process.env.SELENIUM_HUB_URL || 'http://localhost:4444/wd/hub';

    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(options)
      .usingServer(gridUrl)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should load the app successfully', async function () {
    // Docker Compose Network එක ඇතුළේ App Container එකට කතා කරන්නේ 'http://app:3000' මගිනි
    const appUrl = process.env.APP_URL || 'http://app:3000';

    await driver.get(appUrl);

    // Page එකේ body එක load වෙන තෙක් තත්පර 15ක් wait කිරීම
    const bodyText = await driver.wait(
      until.elementLocated(By.tagName('body')),
      15000
    ).getText();

    assert.strictEqual(bodyText.length > 0, true);
  });
});
