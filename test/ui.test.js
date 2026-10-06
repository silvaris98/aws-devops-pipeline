const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('UI Integration Tests', function () {
  this.timeout(60000); // Timeout 60 seconds දක්වා වැඩි කළා
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
    // Docker container name එකෙන් spacexp-app:8080 ට connect වීම
    await driver.get('http://spacexp-app:8080');
    
    // Page title එක ගන්නා තෙක් තත්පර 10ක් Wait කිරීම
    await driver.wait(async () => {
      const title = await driver.getTitle();
      return title !== '';
    }, 10000);

    const title = await driver.getTitle();
    console.log('Successfully fetched Page Title:', title);
  });
});
