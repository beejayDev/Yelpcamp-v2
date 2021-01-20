const express = require("express");
const router = express.Router({mergeParams: true});
const campground = require('../models/campground');
const Review = require('../models/review');
const catchAsync = require("../utils/catchAsync");
const { reviewSchema } = require('../schemaValidation.js');

//SchemaValidations
const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if(error) {
		const msg = error.details.map(el => el.message).join(',');
		throw new ExpressError(msg, 400)
	} else {

		next()
	}
}


router.post('/', validateReview, catchAsync(async (req, res) => {
	const campgrounds = await campground.findById(req.params.id)
	const review = new Review(req.body.review);
	campgrounds.reviews.push(review);
	await campgrounds.save()
	await review.save();
	res.redirect(`/campground/${ campgrounds._id }`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
	const { id, reviewId } = req.params;
	await campground.findByIdAndUpdate(id, {
		$pull: 
		{ reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	res.redirect(`/campground/${ id }`);
}));

module.exports = router;
