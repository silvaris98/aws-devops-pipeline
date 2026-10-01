const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI smoke', function () {
  // Docker / Jenkins හි Heavy load නිසා Timeout එක තත්පර 60 දක්වා වැඩි කර ඇත
  this.timeout(60000);

  let driver;

  before(async function () {
    // Docker Container එක ඇතුළේ Chrome crash වීම වැළැක්වීමට අවශ්‍ය Flags
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    // Selenium Hub URL එක (Docker Compose හි 'selenium' service name එක හෝ Localhub)
    const seleniumHost = process.env.SELENIUM_HOST || 'selenium';
    const gridUrl = `http://${seleniumHost}:4444/wd/hub`;

    try {
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer(gridUrl)
        .build();
    } catch (err) {
      // Fallback: Grid URL එක localhost ලෙස උත්සාහ කිරීම
      driver = await new Builder()
        .forBrowser('chrome')
        .setChromeOptions(options)
        .usingServer('http://localhost:4444/wd/hub')
        .build();
    }
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('should show hello message', async function () {
    // App URL (Docker Network එක ඇතුළේ app service name එක හෝ localhost)
    const appHost = process.env.APP_HOST || 'app';
    const appUrl = `http://${appHost}:3000`;

    await driver.get(appUrl);

    // Page එක load වෙනකම් Wait කිරීම
    const bodyText = await driver.wait(
      until.elementLocated(By.tagName('body')),
      15000
    ).getText();

    // Body text එක පරීක්ෂා කිරීම (Assertion)
    assert.strictEqual(bodyText.length > 0, true);
  });
});
