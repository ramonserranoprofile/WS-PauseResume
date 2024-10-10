const express = require('express');
const app = express();
const { webhookHandler } = require('.');
const dotenv = require('dotenv');
dotenv.config()

app.get('/', webhookHandler);

// Define el nuevo endpoint para continuar el procesamiento
app.get('/path-to-continue-processing', (req, res) => {
    res.send('Continuando el procesamiento después de la redirección...');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});