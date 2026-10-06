const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('UI Integration Tests', function () {
  this.timeout(90000); // Timeout 90s
  let driver;

  before(async function () {
    console.log('--- STARTING SELENIUM BUILDER ---');
    try {
      const options = new chrome.Options();
      options.addArguments('--headless=new');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--window-size=1920,1080');

      // Selenium Grid 4 standalone endpoint (Without /wd/hub if deprecated)
      driver = await new Builder()
        .forBrowser('chrome')
        .usingServer('http://localhost:4444')
        .setChromeOptions(options)
        .build();
        
      console.log('--- SELENIUM DRIVER CREATED SUCCESSFUL ---');
    } catch (err) {
      console.error('--- ERROR INITIALIZING DRIVER ---', err);
      throw err;
    }
  });

  after(async function () {
    if (driver) {
      console.log('--- CLOSING DRIVER ---');
      await driver.quit();
    }
  });

  it('Should load the home page successfully', async function () {
    console.log('--- NAVIGATING TO APP ---');
    await driver.get('http://spacexp-app:8080');
    
    await driver.sleep(2000);

    const title = await driver.getTitle();
    console.log('--- FETCHED PAGE TITLE:', title, '---');

    if (!title) {
      throw new Error('Page title is empty!');
    }
  });
});
