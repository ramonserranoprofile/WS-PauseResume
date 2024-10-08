# automation pause or resume web service


Overall: this script uses Puppeteer to automate a series of actions on a web page, including logging in, navigating to a specific page, interacting with checkboxes, and clicking buttons.

How to Use:
1.- Set up your webhook endpoint on your server to accept a query parameter, 
e.g., 
?action=pause 
or 
?action=resume.

2.- The script extracts the action from the query parameter and performs the corresponding automation.

docker build --no-cache -t ramonserrano76/ws-pauseresume:v1 .
ó
docker build -t ramonserrano76/ws-pauseresume:v1 .

luego

docker run -p 8080:8080 ramonserrano76/ws-pauseresume:v1

PUSH TO DOCKER NETWORKS TO USE:
docker push ramonserrano76/ws-pauseresume:v1