# automation pause or resume web service


Overall: this script uses Puppeteer to automate a series of actions on a web page, including logging in, navigating to a specific page, interacting with checkboxes, and clicking buttons.

How to Use:
1.- Set up your webhook endpoint on your server to accept a query parameter, 
e.g., 
?action=pause 
or 
?action=resume.

2.- The script extracts the action from the query parameter and performs the corresponding automation.

docker build --no-cache -t ramonserrano76/ws-pauseresume:v5 .
ó
docker build -t ramonserrano76/ws-pauseresume:v5 .

luego

docker run -p 8080:8080 ramonserrano76/ws-pauseresume:v5

PUSH TO DOCKER NETWORKS TO USE:
docker push ramonserrano76/ws-pauseresume:v5

consultar disrtros instaladas
wsl.exe -l -v --all

Reinstall WSL:
Open PowerShell as an administrator and run:

wsl --unregister docker-desktop

luego: 
deshabilitar:
dism.exe /online /disable-feature /featurename:VirtualMachinePlatform /norestart
dism.exe /online /disable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart
o Habilitar:
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /norestart
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /norestart
otra forma:
Disable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux -NoRestart

luego:

wsl --install

wsl --set-default-version 2

Actualizar WSL:
Asegúrate de tener la última versión de WSL instalada. Puedes actualizar WSL ejecutando:
wsl --update

# Habilitar el servicio LxssManager
Set-Service -Name LxssManager -StartupType Automatic

# Iniciar el servicio LxssManager
Start-Service -Name LxssManager

Instalar  Docker

Start-Process 'D:\Users\ramon\Downloads\DockerDesktopInstaller.exe' -ArgumentList 'install --installation-dir="D:\Program Files\Docker"' -Wait

o reinstalar Docker
wsl.exe --mount --bare --vhd D:\Users\ramon\AppData\Docker\wsl\DockerDesktopWSL\disk\docker_data.vhdx
wsl.exe --mount --bare --vhd D:\Users\ramon\AppData\Docker\wsl\DockerDesktopWSL\main\ext4.vhdx

POST TO:
precise-carmelle-ramonserrano76-132d3bec.koyeb.app/api/start/developercloud/ramonserrano76@gmail.com

docker run -d --name ws-pauseresume-v5 \
  --cpus="0.1" \
  --memory="512m" \
  -p 8080:8080 \
  --storage-opt size=2G \
  ramonserrano76/ws-pauseresume:v5