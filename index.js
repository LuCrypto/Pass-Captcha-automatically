// Use in classic
const pup = require('puppeteer');

const { delay } = require("@antiadmin/anticaptchaofficial");
const ac = require("@antiadmin/anticaptchaofficial");
const puppeteer = require('puppeteer-core');
const proxyChain = require('proxy-chain');

ac.setAPIKey('ce47d7be3c36f6200dfc4039e2ab9c35');
ac.getBalance()
    .then(balance => console.log('My balance is : ', balance))
    .catch(error => console.log('An error with API key', error));

const login = 'mylogin vrai';
const password = 'my strong password';

const classique = async () => {
    console.log('solving recaptcha...');
    let token = await ac.solveRecaptchaV2Proxyless('https://anti-captcha.com/demo?page=recaptcha_v2_textarea', '6LfydQgUAAAAAMuh1gRreQdKjAop7eGmi6TrNIzp');
    if (!token) {
        console.log('Something went wrong');
        return;
    }

    console.log('opening browser...');
    const browser = await pup.launch();

    console.log('creating new tab...');
    const tab = await browser.newPage();

    console.log('changing windows size...');
    tab.setViewport({ width: 1360, height: 1000 });

    console.log('opening target page...');
    await tab.goto(URL = 'https://anti-captcha.com/demo?page=recaptcha_v2_textarea', { waitUntil: "networkidle0" });

    console.log('filling login input...');
    await tab.$eval('#contentbox > form > div > div:nth-child(1) > span > input', (element, login) => {
        element.value = login
    }, login);

    console.log('filling password input...');
    await tab.$eval('#contentbox > form > div > div:nth-child(2) > span > input', (element, password) => {
        element.value = password
    }, password);

    console.log('setting recaptcha g-response...');
    await tab.$eval('#g-recaptcha-response', (element, token) => {
        element.value = token;
    }, token);

    console.log('submitting form...');
    await Promise.all([
        tab.click('#contentbox > form > div > div.tac.padding20px > button'),
        tab.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    console.log('END TASK, WAIT 1 SECONDS !!!')
    await delay(1000)

    console.log('making a screenshot...');
    await tab.screenshot({ path: 'screenshot.png' });

    console.log('closing browser...');
    await browser.close();
};

// classique().catch(error => console.log('Erreur dans la fonction principale : ', error));

// Ouvrir avec les bons args
// --profile-directory="Profile 13" --disable-domain-reliability --enable-dom-distiller --component-updater=url-source=https://go-updater.brave.com/extensions --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --sync-url=https://sync-v2.brave.com/v2 --lso-url=https://no-thanks.invalid --variations-server-url=https://variations.brave.com/seed --variations-insecure-server-url=https://variations.brave.com/seed --flag-switches-begin --disable-features=ChromeWideEchoCancellation,WebRtcHideLocalIpsWithMdns --flag-switches-end


// --profile-directory="Profile 6"
// PUPPETEER_PRODUCT=brave
// USER AGENT TODO
// const ethermail = async () => {
//     console.log('opening browser...');
//     const browser = await pup.launch({
//         args: [
//             '--profile-directory="Profile 6"'
//             // '--user-data-dir=C:\\Users\\mrssn\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data'
//         ],
//         headless: false,
//         executablePath: 'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
//         userDataDir: 'C:\\Users\\mrssn\\AppData\\Local\\BraveSoftware\\Brave-Browser\\User Data'
//         // ignoreDefaultArgs: ['--disable-extensions'] 
//     });

//     console.log('creating new tab...');
//     const tab = await browser.newPage();

//     console.log('changing windows size...');
//     tab.setViewport({ width: 1360, height: 1000 });

//     console.log('opening target page...');
//     await tab.goto(URL = 'http://api.privateproxy.me:10738/', { waitUntil: "networkidle0" });

//     console.log('END TASK, WAIT 1 SECONDS !!!')
//     await delay(1000)

//     console.log('making a screenshot...');
//     await tab.screenshot({ path: 'screenshot2.png' });

//     console.log('closing browser...');
//     await browser.close();

// };

// ethermail();


const ethermail = async () => {
    const profileSelected = 'Profile 6'
    const proxySelected = 'ha8e9:oqfs0c2n@31.204.3.2:5432'

    const oldProxyUrl = `http://${proxySelected}`;
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

    // ignoreDefaultArgs: ['--disable-extensions']

    console.log('begin')
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
};

// You will also need proxy-chain package:

// npm install proxy-chain
// Sample code:

// const puppeteer = require('puppeteer');
// const proxyChain = require('proxy-chain');

// (async() => {
//   const oldProxyUrl = 'http://ha8e9:oqfs0c2n@31.204.3.2:5432';
//   const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

//   const browser = await puppeteer.launch({
//     args: [`--proxy-server=${newProxyUrl}`],
//   });

//   const page = await browser.newPage();
//   await page.goto('https://httpbin.org/ip');
//   const element = await page.$('pre');
//   const text = await page.evaluate(element => element.textContent, element);
//   console.log(text);
//   await browser.close();

//   await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
// })();