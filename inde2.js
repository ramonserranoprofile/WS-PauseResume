// Import the 'path' module to work with file paths
const { join } = require('path');

// Require Puppeteer and set the configuration
const puppeteer = require('puppeteer');
const puppeteerConfig = require('./.puppeteerrc.cjs');

// Merge the Puppeteer configuration with the default options
const mergedConfig = Object.assign({}, puppeteerConfig, {
    // Add other default options here if needed
});

// Launch Puppeteer with the merged configuration
const launchOptions = {
    headless: "new", // Add other launch options here if needed
    ...mergedConfig, // Spread the merged configuration here
    args: ['--no-sandbox'],
    timeout: 360000, // Set timeout to 360 seconds or adjust as needed
    defaultViewport: null, // Add this line to disable viewport
    // Add the following line to increase protocolTimeout
    protocolTimeout: 360000, // Set protocolTimeout to 360 seconds or adjust as needed
};
const runAutomation = async () => {
    try {
        console.log("Iniciando ejecución del flujo automatizado");

        // Iniciar una instancia de Puppeteer
        const browser = await puppeteer.launch(launchOptions);

        // Crear una nueva página
        const page = await browser.newPage();

        // Configurar los datos de inicio de sesión
        const username = 'duran';
        const password = 'Schloss!19!21';

        // Navegar a la página de inicio de sesión
        await page.goto('https://app.debevet.de/signin?cna=72416&redirect=dashboard');

        // Esperar a que se cargue el formulario de inicio de sesión
        await page.waitForSelector('input[name="username"]');

        // Rellenar el formulario de inicio de sesión y hacer clic en el botón de inicio de sesión
        await page.type('input[name="username"]', username);
        await page.type('input[name="password"]', password);
        await page.click('button[class="btn btn-primary"]');

        // Navegar a la página deseada
        await page.goto('https://app.debevet.de/administration/data');


        // Hacer clic en el botón de descarga
        await page.click('.btn.btn-info[data-toggle="modal"]');


        // Esperar a que aparezca el modal y los checkboxes estén disponibles
        await page.waitForSelector('.modal-dialog');
        await page.waitForSelector('input[type="checkbox"]');

        // Obtener todos los checkboxes dentro del modal
        const checkboxes = await page.$$('input[type="checkbox"]');

        // // Iterar sobre los checkboxes y establecer checked=true
        // for (const checkbox of checkboxes) {
        //     await page.evaluate((element) => {
        //         if (!element.checked) {
        //             element.checked = true;
        //         }
        //     }, checkbox);
        //     // Esperar 1 segundo después de cada clic en el checkbox
        //     await new Promise(r => setTimeout(r, 1000));
        // };

        // // Iterar sobre los checkboxes y establecer checked=true
        // for (const checkbox of checkboxes) {
        //     await page.evaluate((element) => {
        //         if (!element.checked) {
        //             element.click();
        //         }
        //     }, checkbox);
        //     // Esperar 1 segundo después de cada clic en el checkbox
        //     await new Promise(r => setTimeout(r, 1000));
        // };

        // Iterar sobre los checkboxes y establecer checked=true
        for (const checkbox of checkboxes) {
            await page.evaluate((element) => {
                if (!element.checked) {
                    element.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }
            }, checkbox);

            // Verificar si el checkbox está marcado
            const isChecked = await checkbox.evaluate(element => element.checked);

            if (isChecked) {
                console.log("Checkbox marcado correctamente");
            } else {
                console.log("No se pudo marcar el checkbox");
            }
            // Esperar 1 segundo después de cada clic en el checkbox
            await new Promise(r => setTimeout(r, 1000));
        };
        // Verificar si todos los checkboxes están marcados
        const allCheckboxesChecked = await page.evaluate(() => {
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            for (const checkbox of checkboxes) {
                if (!checkbox.checked) {
                    return false;
                }
            }
            return true;
        });
        if (allCheckboxesChecked) {
            console.log("Todos los checkboxes están marcados");
        } else {
            console.log("No todos los checkboxes están marcados");
        }


        await page.click('.modal-footer .btn.btn-info'); // Selecciona el botón "Anlegen"
        // if (createButton) {
        //     createButton.click() = true; // Realiza clic en el botón "Anlegen"
        // };

        await new Promise(r => setTimeout(r, 6000)); // Esperar 3 segundos

        // Cerrar el navegador
        await browser.close();

        return 'Automatización realizada exitosamente!';
    } catch (error) {
        console.error('Error al ejecutar la automatización:', error);
        return 'Error al ejecutar la automatización';
    }
};

const maina = (req, res) => {
    runAutomation()
        .then((result) => {
            console.log(result);
            res.status(200).send(result);
        })
        .catch((error) => {
            console.error(error);
            res.status(500).send('Error al ejecutar la automatización');
        });
};

module.exports = { runAutomation, maina };