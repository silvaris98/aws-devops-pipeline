const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

describe('UI Integration Tests', function () {
  this.timeout(90000);
  let driver;

  before(async function () {
    console.log('--- STARTING SELENIUM BUILDER ---');
    try {
      const options = new chrome.Options();
      options.addArguments('--headless=new');
      options.addArguments('--no-sandbox');
      options.addArguments('--disable-dev-shm-usage');
      options.addArguments('--disable-gpu');
      options.addArguments('--remote-debugging-port=9222');
      options.addArguments('--window-size=1920,1080');

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
    
    const targetUrl = 'http://host.docker.internal:8081';
    let success = false;
    
    // සර්වර් එක ස්ටාර්ට් වන තුරු වාර කිහිපයක් උත්සාහ කිරීම (Retry mechanism)
    for (let i = 0; i < 5; i++) {
        try {
            await driver.get(targetUrl);
            success = true;
            break;
        } catch (err) {
            console.log(`Connection attempt ${i + 1} failed, retrying in 3 seconds...`);
            await driver.sleep(3000);
        }
    }
    
    if (!success) {
        throw new Error('Failed to connect to the application after multiple attempts.');
    }

    const title = await driver.getTitle();
    console.log('--- FETCHED PAGE TITLE:', title, '---');

    if (!title) {
      throw new Error('Page title is empty!');
    }
  });
});
