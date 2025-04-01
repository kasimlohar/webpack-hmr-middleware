const express = require('express');
const path = require('path');
const hmrMiddleware = require('../src/hmrMiddleware');

const app = express();
const port = 3000;

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Add HMR middleware
app.use(hmrMiddleware({
  port: 3001,
  injectClient: true
}));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
