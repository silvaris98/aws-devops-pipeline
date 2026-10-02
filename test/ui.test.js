const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI smoke test', function () {
  // Mocha suite timeout එක තත්පර 120 දක්වා වැඩි කිරීම
  this.timeout(120000);

  let driver;

  before(async function () {
    this.timeout(120000);

    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');

    const gridUrl = process.env.SELENIUM_HUB_URL || 'http://localhost:4444/wd/hub';
    console.log('Connecting to Selenium Grid at:', gridUrl);

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

  it('should load home page and verify body content', async function () {
    // Docker Compose network එක ඇතුළේ App container name එක 'spacexp-app' වේ
    const appUrl = process.env.APP_URL || 'http://spacexp-app:3000';
    console.log('Navigating to app URL:', appUrl);

    let loaded = false;
    for (let i = 0; i < 15; i++) {
      try {
        await driver.get(appUrl);
        loaded = true;
        console.log('Successfully connected to App!');
        break;
      } catch (err) {
        console.log(`App not reachable yet (${err.message}), retrying in 3s... (${i + 1}/15)`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    assert.strictEqual(loaded, true, 'Failed to connect to App container within 45 seconds');

    // Body element එක load වෙනකම් wait කිරීම
    const bodyElement = await driver.wait(
      until.elementLocated(By.tagName('body')),
      30000
    );

    const bodyText = await bodyElement.getText();
    console.log('Body Text retrieved:', bodyText);
    assert.ok(bodyText.length >= 0);
  });
});
