/**
 * This module will start the express server
 */

// import the express app
const webapp = require('./controller/server.js');

const port = process.env.PORT || 3010;
// start the web server
webapp.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
})
