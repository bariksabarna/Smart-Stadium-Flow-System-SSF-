/**
 * Copyright © Sabarna Barik 
 * 
 * This code is open-source for **educational and non-commercial purposes only**.
 * 
 * You may:
 * - Read, study, and learn from this code.
 * - Modify or experiment with it for personal learning.
 * 
 * You may NOT:
 * - Claim this code as your own.
 * - Use this code in commercial projects or for profit without written permission.
 * - Distribute this code as your own work.
 * 
 * If you use or adapt this code, you **must give credit** to the original author: Sabarna Barik
 * For commercial use or special permissions, contact: sabarnabarik@gmail.com
 * 
 * # Copyright © 2026 Sabarna Barik
 * # Non-commercial use only. Credit required if used.
 * 
 * License:
 * This project is open-source for learning only.
 * Commercial use is prohibited.
 * Credit is required if you use any part of this code.
 */

const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`StadiumPulse operational on port ${PORT}`);
});
