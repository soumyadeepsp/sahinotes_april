const express = require('express');
const app = express(); //server instance
const port = 8000;
const expressEjsLayouts = require('express-ejs-layouts');
require('./config/mongoose');

app.use(expressEjsLayouts);

app.set('view engine', 'ejs');
app.set('views', './views');

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.static('./assets'));
app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log('Error in running the server:', err);
        return;
    }
    console.log('Server is running on: ', port);
});

