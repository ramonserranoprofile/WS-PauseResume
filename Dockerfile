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
    && apt-get install -y --no-install-recommends sudo curl gnupg nano wget systemd procps \
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
WORKDIR /app

# Copia los archivos de tu proyecto al contenedor
COPY package*.json ./
COPY .puppeteerrc.cjs ./

# Copia el resto de los archivos

COPY . .

# Instala PM2 globalmente
RUN npm install pm2 -g

# Instala las dependencias de la aplicación
RUN npm cache clean --force \
    && npm install --cache /tmp/empty-cache --prefer-online

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
# Instalar libcap2-bin y otorgar permisos a nice
RUN apt-get update && apt-get install -y libcap2-bin \
    && setcap cap_sys_nice=eip /usr/bin/nice
# Expón el puerto en el que se ejecuta tu aplicación (ajusta según tu aplicación)
EXPOSE 8080

#ENTRYPOINT ["/entrypoint.sh"]

# Comando para iniciar la aplicación
CMD ["pm2-runtime", "start", "server.js", "--name", "WS-pauseresume", "--", "--max-old-space-size=4096"]