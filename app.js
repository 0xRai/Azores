if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
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
const moment = require('moment');
const { grabUserMemberships } = require('./middleware');

const mongoSanitize = require('express-mongo-sanitize');

const indexRouter = require('./routes/index.routes');
const usersRouter = require('./routes/user.routes');
const communityRouter = require('./routes/community.routes');
const postRouter = require('./routes/post.routes');
const commentRouter = require('./routes/comment.routes')
const authRouter = require('./routes/auth.routes')

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

const secret = process.env.SECRET || 'secrettest';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e) {
    console.log("Session store error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: '/'
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
    if (!['/auth/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    };
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.locals.moment = require('moment');
app.use('/', indexRouter);
app.use('/auth', authRouter)
app.use('/user', usersRouter);
app.use('/c', communityRouter);
app.use('/c/:name/posts', postRouter);
app.use('/c/:name/posts/:URLid/:titleURL/comments', commentRouter);

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