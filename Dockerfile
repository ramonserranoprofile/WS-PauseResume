FROM node:20.15.1-bookworm-slim

# No es necesario el Chromium independiente
# ENV PUPPETEER_SKIP_DOWNLOAD false
# ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Instala las dependencias necesarias y actualiza los repositorios
# RUN apt-get update && \
#     apt-get install -y --no-install-recommends fontconfig \
#     curl \
#     gnupg \
#     nano \
#     wget \
#     libatk-bridge2.0-0 \
#     libgtk-3-0 \
#     libx11-xcb1 \
#     libxcomposite1 \
#     libxcursor1 \
#     libxdamage1 \
#     libxext6 \
#     libxi6 \
#     libxrandr2 \
#     libxtst6 \
#     libpango-1.0-0 \
#     fonts-noto-cjk \
#     && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*


# Configura el usuario root
USER root

# Actualiza los repositorios y systemd
RUN apt-get update \
    && apt-get install -y --no-install-recommends systemd \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Instala Google Chrome Stable
RUN apt-get update \
    && apt-get install -y curl gnupg ca-certificates --no-install-recommends \
    && curl -sSL https://dl.google.com/linux/linux_signing_key.pub | gpg --dearmor -o /usr/share/keyrings/google-linux-keyring.gpg \
    && echo "deb [signed-by=/usr/share/keyrings/google-linux-keyring.gpg arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google.list \
    && apt-get update \
    && apt-get install -y google-chrome-stable --no-install-recommends \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
# Establece el directorio de trabajo en el contenedor
# WORKDIR /usr/src/app

# Establece el directorio de trabajo en el contenedor
# Establece el directorio de trabajo en el contenedor
WORKDIR /usr/src/app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
COPY .puppeteerrc.cjs ./
# Copia el resto de los archivos
COPY . .

# Instala las dependencias de la aplicación
RUN npm cache clean --force \
    && npm install --cache /tmp/empty-cache --prefer-online

# Expón el puerto en el que se ejecuta tu aplicación (ajusta según tu aplicación)
EXPOSE 8080

# Comando para iniciar la aplicación
CMD ["npm", "start"]