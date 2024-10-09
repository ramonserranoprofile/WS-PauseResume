const { join } = require('path');
const puppeteer = require('puppeteer');
const puppeteerConfig = require('./.puppeteerrc.cjs');

const mergedConfig = Object.assign({}, puppeteerConfig, {
    // Add other default options here if needed
});

const launchOptions = {
    headless: "new",
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
    ...mergedConfig,
    timeout: 30000,
    defaultViewport: null,
    protocolTimeout: 72000,
};

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const runAutomation = async (action) => {
    const browser = await puppeteer.launch(launchOptions);
    const page = await browser.newPage();

    try {
        console.log("Iniciando ejecución del flujo automatizado");
        await page.goto('https://app.koyeb.com/auth/signin?next=%2Fservices%2Fcdc0d08c-08ee-4a17-9f64-e635cca34e49%2Fsettings');

        await page.type('input[name="email"]', 'ramonserrano76@gmail.com');
        await page.type('input[name="password"]', 'zcYRs6uzF8t#cXk');
        await page.click('button[type="submit"]');

        await page.waitForNavigation({ waitUntil: 'networkidle2' });

        const pauseSelector = 'button[color="orange"]';
        const resumeSelectorBlue = 'button[color="blue"]';
        const resumeSelectorGray = 'button[color="gray"]';
        await delay(4000);
        if (action === 'pause') {
            const pauseButton = await page.$(pauseSelector);
            if (pauseButton) {
                await pauseButton.click();
                console.log('Botón de pausa clicado');
                await delay(2000); // Espera 2 segundos

                await page.waitForSelector('input[name="confirmationText"]');
                await page.type('input[name="confirmationText"]', 'devops');
                await delay(3000); // Espera 3 segundos

                const confirmPauseButtonSelector = 'button[type="submit"].bg-red.text-contrast-red';
                const confirmPauseButton = await page.$(confirmPauseButtonSelector);
                if (confirmPauseButton) {
                    await confirmPauseButton.click();
                    console.log('Botón de confirmación de pausa clicado');
                    await delay(4000); // Espera 4 segundos

                } else {
                    console.error('No se encontró el botón de confirmación de pausa');
                }
            } else {
                console.error('No se encontró el botón de pausa');
            }
        } else if (action === 'resume') {
            const resumeButtonBlue = await page.$(resumeSelectorBlue);
            const resumeButtonGray = await page.$(resumeSelectorGray);
            if (resumeButtonBlue) {
                try {
                    await resumeButtonBlue.click();
                    console.log('Botón de reanudar (azul) clicado');
                    await delay(3000); // Espera 3 segundos
                } catch (error) {
                    console.error('Error al clicar en el botón de reanudar (azul) o no esta pausado el servicio:', error);
                }

            } else if (resumeButtonGray) {
                try {
                    await resumeButtonGray.click();
                    console.log('Botón de reanudar (gris) clicado');
                    await delay(3000); // Espera 3 segundos
                } catch (error) {
                    console.error('Error al clicar en el botón de reanudar (gris) o no esta pausado el servicio:', error);
                }

            } else {
                console.error('No se encontró ningún botón de resume');
            }
        } else {
            throw new Error('Invalid action');
        }

        console.log(`Action '${action}' completed.`);
    } catch (error) {
        console.error('Automation failed:', error);
    } finally {
        await browser.close();
    }
};

const webhookHandler = (req, res) => {
    const action = req.query.action;
    let responded = false;

    // Set a timeout to send a 3xx response after 25 seconds
    const timeout = setTimeout(() => {
        if (!responded) {
            res.redirect(307, '/path-to-continue-processing');
            responded = true;
        }
    }, 25000);

    runAutomation(action)
        .then(() => {
            if (!responded) {
                clearTimeout(timeout);
                res.status(200).send(`Action '${action}' executed`);
                responded = true;
            }
        })
        .catch((error) => {
            if (!responded) {
                clearTimeout(timeout);
                res.status(500).send(`Error executing action: ${error.message}`);
                responded = true;
            }
        });
};

module.exports = { webhookHandler };