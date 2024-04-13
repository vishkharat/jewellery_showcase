const express = require('express');
const router = express.Router();
const designcontroller = require('../controllers/designController.js');

/**
 * app Routes
 */
router.get('/', designcontroller.homepage);
router.get('/design/:id', designcontroller.exploreDesign); // Corrected controller method reference
router.get('/categories', designcontroller.exploreCategories); 
router.get('/categories/:id', designcontroller.exploreCategoriesById); 
router.post('/search', designcontroller.searchDesign); 
router.get('/explore-latest', designcontroller.exploreLatest); 
router.get('/explore-random', designcontroller.exploreRandom); 
router.get('/submit-design', designcontroller.submitDesign); 
router.post('/submit-design', designcontroller.submitDesignOnPost);
router.get('/about', designcontroller.aboutPage); // Add this route for the About page
router.get('/contact', designcontroller.contactPage);
router.post('/contact', designcontroller.sendContactMessage);


module.exports = router;
