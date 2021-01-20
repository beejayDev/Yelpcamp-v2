const express = require("express");
const router = express.Router();
const campground = require('../models/campground');
const catchAsync = require("../utils/catchAsync");
const { campgroundSchema } = require('../schemaValidation.js');

//SchemaValidations
const schemaValidation = (req, res, next) => {
	const { error } = campgroundSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else {
		next()                                                         }
}


router.get('/', async (req, res) => {
	const campgrounds = await campground.find({})
	res.render('campgrounds/index', { campgrounds })
});

router.get("/new", (req, res) => {
	res.render("campgrounds/new")
});

router.post("/", schemaValidation, catchAsync(async (req, res) => {
	const camps = req.body.camp;
	const newCamp = new campground(camps)
	await newCamp.save();
	res.redirect(`/campground/${newCamp._id}`);
}));

router.get('/:id', schemaValidation, catchAsync(async (req, res) => {
	const { id } = req.params;
	const newCamp = await campground.findById(id).populate('reviews');
	res.render('campgrounds/show', { newCamp })                    }));

router.get('/:id/edit', schemaValidation, catchAsync( async (req, res) => {
	const { id } = req.params;
	const newCamp = await campground.findById(id);
	res.render('campgrounds/edit', { newCamp })
}));

router.delete("/:id", schemaValidation, catchAsync(async (req,
res) => {
	const { id } = req.params;
	const delCamp = await campground.findByIdAndDelete(id);
	res.redirect('/campground');
}));

module.exports = router;
