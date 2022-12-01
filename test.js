const proxyChain = require('proxy-chain');
const { delay } = require("@antiadmin/anticaptchaofficial");

(async () => {
    const profileSelected = 'Profile 6'
    const proxySelected = 'ha8e9:oqfs0c2n@31.204.3.2:5432'

    const oldProxyUrl = `http://${proxySelected}`;
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    // ignoreDefaultArgs: ['--disable-extensions']

    console.log('begin')
    const puppeteer = require('puppeteer-core');
    const browser = await puppeteer.launch({
        headless: false,
        executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe', // For Windows
        args: [
            `--proxy-server=${newProxyUrl}`,
            '--user-data-dir=C:\\Users\\mrssn\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data', // For Windows
            `--profile-directory=${profileSelected}` // This to select default or specified Profile
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    });

    console.log('creating new tab...');
    const tab = await browser.newPage();

    console.log('changing windows size...');
    tab.setViewport({ width: 1360, height: 1000 });

    console.log('opening target page...');
    await tab.goto(URL = 'http://api.privateproxy.me:10738/', { waitUntil: "networkidle0" });

    console.log('END TASK, WAIT 1 SECONDS !!!')
    await delay(10000)

    console.log('making a screenshot...');
    await tab.screenshot({ path: 'screenshot3.png' });

    console.log('closing browser...');
    await browser.close();

    await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
})();