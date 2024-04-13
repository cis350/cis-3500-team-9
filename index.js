/**
 * This module will start the express server
 */

// import the express app
const webapp = require('./server/controller/server.js');

const port = 8080;
// start the web server
webapp.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
})
