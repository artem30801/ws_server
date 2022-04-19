# WorldSkills Monitoring Server
Intended for use in "warehouse monitoring" module in "Areal Robotics" WorldSkills competition to provide a way for real-time data broadcasting from drone to any display to allow graphic, objective, and verifiable judgment.

![image](https://user-images.githubusercontent.com/38689676/164006424-eedd9f18-f6dd-4687-bd42-332ca58ff386.png)
![image](https://user-images.githubusercontent.com/38689676/164007070-58643469-8b79-468b-898e-83b6dbc730cf.png)

[Demonstation video](https://youtu.be/LIdvWNz821E?t=26393)

## Launch (for organisation team)
Launch on computer (or server) with satic IP or IP avialible from all drones in local network
Port `8090` should be avialible to the network

1) Download (or clone) this repository
```
git clone https://github.com/artem30801/ws_server.git
```
2) Launch via docker-compose:
```
cd ws_server
docker-compose up -d --build
```
3) Provide competitors with instructions below and a link (hostname and port) to the computer this server is running on

4) Open link in your browser to see montiring webpage. All data from drones will be broadcasted to all open webpages.

## Usage (for competitors)
Detailed user instruction avialible at:
https://docs.google.com/document/d/1oa2EUU3FADKY4ly-WGqPq_ykVAgdWiKr6cvdhjeF7xc/edit
