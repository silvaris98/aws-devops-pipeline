const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('UI Integration Tests', function () {
  this.timeout(30000); // 30 seconds timeout
  let driver;

  before(async function () {
    // Chrome Headless සහ CI flags සැකසීම
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    options.addArguments('--disable-gpu');
    options.addArguments('--window-size=1920,1080');

    console.log('Connecting to Selenium Grid at: http://localhost:4444/wd/hub');

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
    // Docker network එක ඇතුළේ spacexp-app එකට connect වේ
    await driver.get('http://spacexp-app:8080');
    const title = await driver.getTitle();
    console.log('Page Title:', title);
  });
});
