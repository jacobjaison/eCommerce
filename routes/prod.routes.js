const Product = require('../models/Product.model');
const router = require('express').Router();

router.get('/', async (req,res,next) => {
    try {
        res.render('products/products-list');

    } catch (error) {
        next (error);
    }
})

router.get('/create', async (req, res, next) => {
    try {
        res.render('products/products-create')
    } catch (error) {
        next (error)
    }
})

router.post('/create', async (req,res,next) => {
    try {
        const {prodName, prodDesc,prodImage,prodPrice,prodStock} = req.body;
        await Product.create ({
            prodName,
            prodDesc,
            prodImage,
            prodPrice,
            prodStock,
        });
        res.redirect('/');
    } catch (error) {
        next (error)
    }
})

module.exports = router;