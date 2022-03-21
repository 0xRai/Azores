if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.schema');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const indexRouter = require('./routes/index.routes');
const usersRouter = require('./routes/user.routes');
const communityRouter = require('./routes/community.routes');
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes')

const app = express();

const port = 3000;
const MongoDBStore = require('connect-mongo')(session);
const dbUrl = 'mongodb://localhost:27017/azores';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.engine('ejs', ejsMate);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    // store,
    name: 'session',
    secret: 'testsecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    if (!['/user/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    };
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/c', communityRouter);
app.use('/c/:id/posts', postRouter);
app.use('/c/:id/posts/:id/', commentRouter);

// catch 404 and forward to error handler
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})


// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.listen(port, () => {
    console.log(`Listening on PORT: ${port}`);
})

module.exports = app;