/**
 * Receive a plain text SQL query and return the result as a JSON object.
 */

const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const util = require('util');

const app = express();
app.use(express.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'cole',
    password: '2653',
    database: 'powerCompany'
});

app.get('/', async function (req, res) {
    // receive a plain text SQL query, execute it, and return the result as a JSON object
    console.log(`Received query "${req.query.sql}"`);

    // convert connection.query to a promise because callback hell is hell
    // we do .bind(connection) because connection.query depends on this being the connection
    const query = util.promisify(connection.query).bind(connection);

     let result;
     try { 
         result = await query(req.query.sql);
     } catch (err) {
          res.status(400).send(err);
          return;
     }
     res.status(200).json(result);
});

const port = process.env.PORT || 6969;
const server = app.listen(port, function () {
    console.log('Server is running on port ' + port);
});

// graceful shutdown should close the database connection
const shutdownHandler = (e) => {
    console.log('\nAbout to exit, closing database connections');
    connection.end();
    process.exit(0);
};

process.on('exit', shutdownHandler);
process.on('SIGINT', shutdownHandler);
