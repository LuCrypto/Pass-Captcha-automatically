// Use in classic, not use in my version
const pup = require('puppeteer');

const { delay } = require("@antiadmin/anticaptchaofficial");
const ac = require("@antiadmin/anticaptchaofficial");
const puppeteer = require('puppeteer-core');
const proxyChain = require('proxy-chain');
const express = require('express')
const app = express();

// serve ressurces from current folder
app.use(express.static(__dirname))
const server = app.listen(5000);
console.log('serveur lancee')

ac.setAPIKey('ce47d7be3c36f6200dfc4039e2ab9c35');
ac.getBalance()
    .then(balance => console.log('My balance is : ', balance))
    .catch(error => console.log('An error with API key', error));


// Exemple 1 de la vidéo tuto
// https://anti-captcha.com/tutorials/how-to-submit-recaptcha-gresponse-with-textarea
// Vous pouvez noter que nous résolvons d'abord le captcha et seulement ensuite nous naviguons sur la page et collons le résultat.
// Cela fonctionne pour Recaptcha car nous connaissons déjà le sitekey et la durée de vie du token est de 120 secondes.
const resolveCaptchaWithSubmit = async (withProxy) => {
    const login = 'mylogin vrai';
    const password = 'my strong password';

    // solveRecaptchaV2ProxyOn => résoudre avec mon proxy
    // solveRecaptchaV2Proxyless => résoudre sans mon proxy

    console.log('solving recaptcha...');
    let token = false;

    if (withProxy) {
        // Glenna
        // 31.204.3.2:5432:ha8e9:oqfs0c2n
        token = await ac.solveRecaptchaV2ProxyOn('https://anti-captcha.com/demo?page=recaptcha_v2_textarea',
            '6LfydQgUAAAAAMuh1gRreQdKjAop7eGmi6TrNIzp',
            'http',
            '31.204.3.2',
            '5432',
            'ha8e9',
            'oqfs0c2n',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116',
            'some=cookies')
    }
    else {
        token = await ac.solveRecaptchaV2Proxyless('https://anti-captcha.com/demo?page=recaptcha_v2_textarea',
            '6LfydQgUAAAAAMuh1gRreQdKjAop7eGmi6TrNIzp');
    }

    if (!token) {
        console.log('Something went wrong');
        return;
    }

    console.log('token get : ', token)
    console.log('opening browser...');
    const browser = await pup.launch({
        headless: false
    });

    console.log('creating new page...');
    const page = await browser.newPage();

    console.log('changing windows size...');
    page.setViewport({ width: 1360, height: 1000 });

    console.log('opening target page...');
    await page.goto(URL = 'https://anti-captcha.com/demo?page=recaptcha_v2_textarea', { waitUntil: "networkidle0" });

    console.log('filling login input...');
    await page.$eval('#contentbox > form > div > div:nth-child(1) > span > input', (element, login) => {
        element.value = login
    }, login);

    console.log('filling password input...');
    await page.$eval('#contentbox > form > div > div:nth-child(2) > span > input', (element, password) => {
        element.value = password
    }, password);

    console.log('setting recaptcha g-response...');
    await page.$eval('#g-recaptcha-response', (element, token) => {
        element.value = token;
    }, token);

    console.log('submitting form...');
    await Promise.all([
        page.click('#contentbox > form > div > div.tac.padding20px > button'),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    console.log('END TASK, WAIT 1 SECONDS !!!');
    await delay(1000);

    console.log('making a screenshot...');
    await page.screenshot({ path: 'screenshot.png' });

    console.log('closing browser...');
    await browser.close();
};


// Exemple 2 de la vidéo tuto
// https://anti-captcha.com/tutorials/submit-form-with-recaptcha-using-callback-function
// Pour resolve un captcha sans bouton de submit
const resolveCaptchaWithoutSubmitAndWithFunctionName = async (withProxy) => {
    const login = 'mylogin vrai';
    const password = 'my strong password';

    // solveRecaptchaV2ProxyOn => résoudre avec mon proxy
    // solveRecaptchaV2Proxyless => résoudre sans mon proxy

    console.log('solving recaptcha...');
    let token = 'false';
    let webSiteUrl = 'https://anti-captcha.com/demo?page=recaptcha_v2_callback'
    let siteKey = '6LctBtAZAAAAANJDH7_ArYcwy0MxIfyfeMuZ5ywk'

    if (withProxy) {
        // Glenna
        // 31.204.3.2:5432:ha8e9:oqfs0c2n
        token = await ac.solveRecaptchaV2ProxyOn(webSiteUrl,
            siteKey,
            'http',
            '31.204.3.2',
            '5432',
            'ha8e9',
            'oqfs0c2n',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116',
            'some=cookies')
    }
    else {
        token = await ac.solveRecaptchaV2Proxyless(webSiteUrl,
            siteKey);
    }

    if (!token) {
        console.log('Something went wrong');
        return;
    }

    console.log('token get : ', token)
    console.log('opening browser...');
    const browser = await pup.launch({
        headless: false
    });

    console.log('creating new page...');
    const page = await browser.newPage();

    console.log('changing windows size...');
    page.setViewport({ width: 1360, height: 1000 });

    console.log('opening target page...');
    await page.goto(URL = webSiteUrl, { waitUntil: "networkidle0" });

    console.log('filling login input...');
    await page.$eval('#login', (element, login) => {
        element.value = login
    }, login);

    console.log('filling password input...');
    await page.$eval('#pass', (element, password) => {
        element.value = password
    }, password);

    // Check captcha callback
    // name : checkCaptcha
    // To retrieve the actual site key, we simply load the page and check tab network
    // Find the site key on anchor as a request parameter
    // site key : 6LctBtAZAAAAANJDH7_ArYcwy0MxIfyfeMuZ5ywk

    console.log('setting recaptcha g-response...');

    await page.evaluate((token) => {
        // On appelle la fonction qui est sur le site : checkCaptcha
        checkCaptcha(token)
    }, token);

    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    console.log('END TASK, WAIT 7 SECONDS !!!');
    await delay(7000);

    console.log('making a screenshot...');
    await page.screenshot({ path: 'screenshot.png' });

    console.log('closing browser...');
    await browser.close();
};


// Exemple 3 de la vidéo tuto
// https://anti-captcha.com/tutorials/recaptcha-with-anonymous-callback-function
// Pour resolve un captcha sans bouton de submit et sans nom de fonction callback
const resolveCaptchaWithoutSubmitAndWithAnonymousName = async (withProxy) => {
    const login = 'mylogin vrai 3';
    const password = 'my strong password 3';

    console.log('solving recaptcha...');
    let token = 'false';
    let webSiteUrl = 'https://anti-captcha.com/demo?page=recaptcha_v2_anonymous_callback'
    let siteKey = '6LdsBtAZAAAAAKD3r6e3kb4gclEXjpBXky65UbOP'

    if (withProxy) {
        // Glenna
        // 31.204.3.2:5432:ha8e9:oqfs0c2n
        token = await ac.solveRecaptchaV2ProxyOn(webSiteUrl,
            siteKey,
            'http',
            '31.204.3.2',
            '5432',
            'ha8e9',
            'oqfs0c2n',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116',
            'some=cookies')
    }
    else {
        token = await ac.solveRecaptchaV2Proxyless(webSiteUrl,
            siteKey);
    }

    if (!token) {
        console.log('Something went wrong');
        return;
    }

    // token = 'test'

    console.log('token get : ', token)
    console.log('opening browser...');
    const browser = await pup.launch({
        headless: false
    });

    console.log('creating new page...');
    const page = await browser.newPage();

    console.log('changing windows size...');
    page.setViewport({ width: 1360, height: 1000 });

    // NOUVEAU
    console.log('setting interception rule...')
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        // tester avec https://anti-captcha.com/demo/anonymous.js?r=241136
        if (request.resourceType() === 'script' && request.url().indexOf('anonymous.js') != -1) {
            console.log('aborting load of ' + request.url());
            request.abort();
        } else {
            request.continue();
        }
    })

    console.log('opening target page...');
    await page.goto(URL = webSiteUrl, { waitUntil: "networkidle0" });

    // NOUVEAU
    console.log('injecting local script...');
    await page.addScriptTag({
        url: 'http://localhost:5000/inject.js'
    });
    console.log('4 secondes attentes')
    await delay(4000)

    console.log('filling login input...');
    await page.$eval('#login', (element, login) => {
        element.value = login
        // Envoyer l'event change
        element.dispatchEvent(new Event('change'));
    }, login);

    console.log('filling password input...');
    await page.$eval('#pass', (element, password) => {
        element.value = password
    }, password);

    // Check captcha callback
    // name : checkCaptcha
    // To retrieve the actual site key, we simply load the page and check tab network
    // Find the site key on anchor as a request parameter
    // site key : 6LctBtAZAAAAANJDH7_ArYcwy0MxIfyfeMuZ5ywk

    console.log('setting recaptcha g-response...');

    await page.evaluate((token) => {
        // On appelle la fonction qui est sur le site : checkCaptcha
        checkCaptcha(token)
    }, token);

    await page.waitForNavigation({ waitUntil: 'networkidle0' })

    console.log('END TASK, WAIT 7 SECONDS !!!');
    await delay(7000);

    console.log('making a screenshot...');
    await page.screenshot({ path: 'screenshot.png' });

    console.log('closing browser...');
    await browser.close();
};



// Ouvrir avec les bons args
// --profile-directory="Profile 13" --disable-domain-reliability --enable-dom-distiller --component-updater=url-source=https://go-updater.brave.com/extensions --origin-trial-public-key=bYUKPJoPnCxeNvu72j4EmPuK7tr1PAC7SHh8ld9Mw3E=,fMS4mpO6buLQ/QMd+zJmxzty/VQ6B1EUZqoCU04zoRU= --sync-url=https://sync-v2.brave.com/v2 --lso-url=https://no-thanks.invalid --variations-server-url=https://variations.brave.com/seed --variations-insecure-server-url=https://variations.brave.com/seed --flag-switches-begin --disable-features=ChromeWideEchoCancellation,WebRtcHideLocalIpsWithMdns --flag-switches-end

// Premier test réel
// 1 Aller sur https://ethermail.io/
// 2 Cliquer sur Sign up for Free
// 3 Résolver le captcha -> anti captcha : utiliser leur API
// 4 Se connecter et sign in avec metamask
// 5 Rentrer une adresse mail
// 6 Ouvrir les mails rapidement (facultatif)
const ethermail = async (profileSelected, proxySelected) => {

    console.log('solving recaptcha...');
    let token = await ac.solveRecaptchaV2Proxyless('https://ethermail.io/', '6LdmCaMhAAAAAHuCRyI8Y_K3JbITDhW623QkEPIi');
    if (!token) {
        console.log('Something went wrong');
        return;
    }

    console.log('profileSelected : ', profileSelected)
    console.log('proxySelected : ', proxySelected)

    const oldProxyUrl = `http://${proxySelected}`;
    const newProxyUrl = await proxyChain.anonymizeProxy(oldProxyUrl);

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

    console.log('creating new page...');
    const page = await browser.newPage();

    console.log('changing windows size...');
    page.setViewport({ width: 1360, height: 1000 });

    // 1 Aller sur https://ethermail.io/
    console.log('opening target page...');
    await page.goto(URL = 'https://ethermail.io/', { waitUntil: "networkidle0" });
    console.log('making a screenshot...');
    await page.screenshot({ path: '1etape.png' });

    // 2 Cliquer sur Sign up for Free
    await page.click("button.flex:nth-child(1)");
    console.log('cliquer done 10 secondes...');
    await delay(1000);
    console.log('making a screenshot...');
    await page.screenshot({ path: '2etape.png' });

    // 3 Résolver le captcha -> anti captcha : utiliser leur API
    console.log('setting recaptcha g-response...');
    await page.$eval('#g-recaptcha-response', (element, token) => {
        console.log('token : ', token)
        element.value = token;
    }, token);

    console.log('submitting form...');
    await Promise.all([
        page.click('#contentbox > form > div > div.tac.padding20px > button'),
        page.waitForNavigation({ waitUntil: 'networkidle0' })
    ]);

    console.log('END !!!');
    await delay(10000);

    // END
    console.log('closing browser...');
    await browser.close();

    await proxyChain.closeAnonymizedProxy(newProxyUrl, true);
};

// ethermail('Profile 6', 'ha8e9:oqfs0c2n@31.204.3.2:5432');

// Erreur possible : ERROR_FAILED_LOADING_WIDGET
// Seule solution trouvee : recommencer

const monMain = async () => {
    let rate = true;
    while (rate) {
        await ac.getBalance()
            .then(balance => console.log('My balance is : ', balance))
            .catch(error => console.log('An error with API key', error));
        await resolveCaptchaWithoutSubmitAndWithAnonymousName(withProxy = false)
            .then(() => {
                rate = false;
            })
            .catch(error => {
                console.log('Erreur dans la fonction principale : ', error);
                if (error == 'ERROR_FAILED_LOADING_WIDGET') {
                    console.log('recommencer')
                }
                else {
                    rate = false
                }
            })
            .finally(() => {
                if (!rate) {
                    console.log('REUSSI !');
                }
                else {
                    console.log('On refait...');
                }
            });
    }
    server.close();
}

monMain()