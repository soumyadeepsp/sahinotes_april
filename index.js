const express = require('express');
const app = express(); //server instance
const port = 8000;
const expressEjsLayouts = require('express-ejs-layouts');
require('./config/mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('./config/passport-local-strategy');
const session = require('express-session');
//ES helps in creating sessions and stores them in cookies 
// cookie-parser helps in storing those cookies in the rrequest and getting it back from response
const mongoStore = require('connect-mongo');
require('./config/passport-google-strategy');
require('./config/nodemailer');
const axios = require('axios');
const flash = require('connect-flash');
const flashMiddleware = require('./config/middleware');
const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    outputStyle: 'extended',
    prefix: '/css'
}));

app.use(expressEjsLayouts);


app.set('view engine', 'ejs');
app.set('views', './views');

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded()); //helps in making POST api calls
app.use(cookieParser()); //helps in putting cookies to req and taking from res

app.use(express.static('./assets'));
app.use('/uploads/notes', express.static('/uploads/notes'));

app.use(session({
    name: 'sahinotes',
    secret: 'codingninjas',
    cookie: {
        maxAge: (60*60*24*1000)
    },
    store: mongoStore.create({mongoUrl: 'mongodb://localhost/sahinotes_development'})
}));
app.use(passport.initialize());
app.use(passport.session());
// flash uses sessions cookie so call it after calling session
app.use(flash());
app.use(flashMiddleware.flash);

app.use('/', require('./routes'));

app.listen(port, function(err) {
    if (err) {
        console.log('Error in running the server:', err);
        return;
    }
    console.log('Server is running on: ', port);
});

// clientID - 1048626114643-ikmsqg0j9pdlf2dkhcmavv7soo7oh03d.apps.googleusercontent.com
// client secret - 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