const express = require('express');
const path = require('path');
const port = 3000;
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const db = mongoose.connection;
const methodOverride = require('method-override');


//Database connection
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);                        
const connectionString = "mongodb+srv://Makanaki:ibrahim_12345@beejaycodes.iwhuw.mongodb.net/yelpcampV2?retryWrites=true&w=majority"

mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
});

//Requiring Routes
const CampgroundRoutes = require("./routes/campgrounds");
const ReviewRoutes = require("./routes/review");

//const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('we\'re connected!');
});

const app = express();

//EJS Settings
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.session({
	name: "sessions",
	secret: "Allah is God",
	resave: false,
	saveUninitialized: false,
	cookie: {
		path: "/",
                //key: '_csrf',
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
		httpOnly: true,
                signed: false,
                secure: false,
                sameSite: true
        }

}));
//Mounting Routes 
app.get('/', (req, res) => {
	res.render('index')
});
app.use("/campground", CampgroundRoutes);
app.use("/campground/:id/review", ReviewRoutes);


//Catch 404 errors and pass to error handlers
app.get("*", (req, res, next) => {
	next(new ExpressError("Page not found", 404));
});

//Error Handler rendering error page
app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if(!err.message) err.message = "Something went wrong"
	res.status(statusCode).render('error', { err });
});

//Server running 
app.listen(port, () => {
	console.log(`App listening on port ${port}`)
});

