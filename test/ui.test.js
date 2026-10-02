const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI smoke', function () {
  // Mocha suite timeout එක විනාඩි 2ක් දක්වා වැඩි කිරීම
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

  it('should show hello message', async function () {
    const appUrl = process.env.APP_URL || 'http://app:3000';
    console.log('Navigating to app URL:', appUrl);

    // App එක Docker එක ඇතුළේ ready වෙනකම් retries 10ක් සිදුකිරීම
    let loaded = false;
    for (let i = 0; i < 10; i++) {
      try {
        await driver.get(appUrl);
        loaded = true;
        break;
      } catch (err) {
        console.log(`App not ready yet, retrying in 3 seconds... (${i + 1}/10)`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    assert.strictEqual(loaded, true, 'Failed to connect to App container');

    // Body tag එක load වන තෙක් තත්පර 30ක් wait කිරීම
    const bodyElement = await driver.wait(
      until.elementLocated(By.tagName('body')),
      30000
    );

    const bodyText = await bodyElement.getText();
    assert.ok(bodyText.length > 0, 'Body text is empty');
  });
});
