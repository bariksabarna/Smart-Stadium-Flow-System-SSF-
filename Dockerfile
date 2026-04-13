# Copyright © Sabarna Barik 
# 
# This code is open-source for **educational and non-commercial purposes only**.
# 
# You may:
# - Read, study, and learn from this code.
# - Modify or experiment with it for personal learning.
# 
# You may NOT:
# - Claim this code as your own.
# - Use this code in commercial projects or for profit without written permission.
# - Distribute this code as your own work.
# 
# If you use or adapt this code, you **must give credit** to the original author: Sabarna Barik
# For commercial use or special permissions, contact: sabarnabarik@gmail.com
# 
# # Copyright © 2026 Sabarna Barik
# # Non-commercial use only. Credit required if used.
# 
# License:
# This project is open-source for learning only.
# Commercial use is prohibited.
# Credit is required if you use any part of this code.

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]
