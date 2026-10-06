const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('UI Integration Tests', function () {
  this.timeout(60000); // 60 seconds test timeout
  let driver;

  before(async function () {
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    console.log('Connecting to Selenium Grid at http://localhost:4444/wd/hub...');

    driver = await new Builder()
      .forBrowser('chrome')
      .usingServer('http://localhost:4444/wd/hub')
      .setChromeOptions(options)
      .build();
  });

  after(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it('Should load the home page successfully', async function () {
    console.log('Navigating to http://spacexp-app:8080...');
    await driver.get('http://spacexp-app:8080');

    // Page එක fully load වන තෙක් තත්පර 15ක් Wait කිරීම
    await driver.sleep(3000);

    const title = await driver.getTitle();
    console.log('Fetched Page Title:', title);

    if (!title) {
      throw new Error('Page title is empty or page failed to render!');
    }
  });
});
