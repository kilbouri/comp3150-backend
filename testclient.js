// connect to server on localhost:6969 and send a basic GET request
// query is 'SELECT * FROM employees'

const http = require('http');

http.get('http://colef.club:6969/?sql=SELECT * FROM employees', (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log(data);
    });
});