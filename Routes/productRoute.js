const express = require('express');
const router = express.Router();

const{handleResultsDisplay,handleResultsRequest} = require('../Controllers/productController');



router.post('/results', handleResultsDisplay);
router.get('/results',handleResultsRequest);


module.exports = router;
