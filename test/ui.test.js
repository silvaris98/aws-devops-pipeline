const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI smoke test', function () {
  this.timeout(120000); // Suite level timeout 2 minutes

  let driver;

  before(async function () {
    this.timeout(120000);

    const options = new chrome.Options();
    // Docker container ඇතුළේ Chrome stable ලෙස දිවීමට අත්‍යවශ්‍ය flags
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--disable-software-rasterizer');
    options.addArguments('--disable-dev-tools');
    options.addArguments('--window-size=1920,1080');

    const gridUrl = process.env.SELENIUM_HUB_URL || 'http://localhost:4444/wd/hub';
    console.log('Connecting to Selenium Grid at:', gridUrl);

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer(gridUrl)
        .build();
      console.log('Successfully created Remote WebDriver instance.');
    } catch (err) {
      console.error('Failed to initialize WebDriver:', err.message);
      throw err;
    }
  });

  after(async function () {
    if (driver) {
      try {
        await driver.quit();
        console.log('WebDriver session closed.');
      } catch (err) {
        console.error('Error closing driver:', err.message);
      }
    }
  });

  it('should load home page and verify body content', async function () {
    const appUrl = process.env.APP_URL || 'http://spacexp-app:3000';
    console.log('Navigating to app URL:', appUrl);

    let loaded = false;
    for (let i = 1; i <= 15; i++) {
      try {
        await driver.get(appUrl);
        loaded = true;
        console.log(`[Attempt ${i}/15] Successfully loaded page from ${appUrl}`);
        break;
      } catch (err) {
        const errorMsg = err ? (err.message || String(err)) : 'Unknown error';
        console.log(`[Attempt ${i}/15] App not reachable yet: ${errorMsg}. Retrying in 3s...`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    assert.strictEqual(loaded, true, `Failed to reach App container at ${appUrl} after 15 attempts.`);

    const bodyElement = await driver.wait(
      until.elementLocated(By.tagName('body')),
      30000
    );

    const bodyText = await bodyElement.getText();
    console.log('Body Text retrieved:', bodyText);
    assert.ok(bodyText !== null && bodyText !== undefined);
  });
});
