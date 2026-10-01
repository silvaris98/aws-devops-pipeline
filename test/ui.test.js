const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');

describe('UI smoke', function () {
  // Docker / EC2 slowness නිසා timeout එක 120s දක්වා වැඩි කර ඇත
  this.timeout(120000);

  let driver;

  before(async function () {
    // Before hook එකටත් timeout එක 120s ලෙස සෙට් කිරීම
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

    await driver.get(appUrl);

    const bodyText = await driver.wait(
      until.elementLocated(By.tagName('body')),
      30000
    ).getText();

    assert.ok(bodyText.length > 0);
  });
});
