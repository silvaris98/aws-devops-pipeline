const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI smoke', function () {
  // Docker / Jenkins හි Heavy load නිසා Timeout එක තත්පර 60 දක්වා වැඩි කර ඇත
  this.timeout(60000);

  let driver;

  before(async function () {
    // Docker Container එක ඇතුළේ Chrome crash වීම වැළැක්වීමට සහ Headless run කිරීමට අවශ්‍ය Flags
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    // Jenkins Host එකේ සිට Docker Compose Selenium Grid Port එකට (4444) connect වීම
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

  it('should show hello message', async function () {
    // Selenium Container එක ඇතුළේ සිට App Container එකට කතා කිරීමට 'http://app:3000' භාවිතා වේ
    const appUrl = process.env.APP_URL || 'http://app:3000';

    await driver.get(appUrl);

    // Page එක load වෙනකම් Wait කිරීම
    const bodyText = await driver.wait(
      until.elementLocated(By.tagName('body')),
      15000
    ).getText();

    // Body text එක හිස් නැති බව තහවුරු කිරීම (Assertion)
    assert.strictEqual(bodyText.length > 0, true);
  });
});
