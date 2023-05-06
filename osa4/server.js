const app = require('./index');
const http = require('http');

const PORT = process.env.PORT || 3004;
const server = http.createServer(app);


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
