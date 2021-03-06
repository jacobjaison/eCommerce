const Product = require('../models/Product.model');
const Category = require('../models/Category.model');
const router = require('express').Router();

router.get('/create', async (req, res, next) => {
    try {
        res.render('products/products-create')
    } catch (error) {
        next (error)
    }
})

router.post('/create', async (req,res,next) => {
    try {
        const {prodName, prodDesc,prodCategory,prodImage,prodPrice,prodStock} = req.body;
        await Product.create ({
            prodName,
            prodDesc,
            prodCategory,
            prodImage,
            prodPrice,
            prodStock,
        });
        res.redirect('/products/products-list');
    } catch (error) {
        next (error)
    }
})


router.get('/', async(req,res,next) => {
    try {
        const products = await Product.find();
        const categories = await Category.find();
        res.render('products/products-list', {products,categories});
    } catch (error) {
        next (error);
    }
})

router.get('/products-list', async(req,res,next) => {
    try {
        const products = await Product.find();
        const categories = await Category.find();
        res.render('products/products-list', {products,categories});
    } catch (error) {
        next (error);
    }
})

router.get('/:id/edit', async (req,res,next) => {
    try {
        const {id} = req.params;
        let product = await Product.findById(id);

        res.render('products/products-edit', product);
    } catch (error) {
        next (error)
    }
})

router.post('/:id/edit', async (req,res,next) => {
    try {
        const {id} = req.params;
        const {prodName, prodDesc,prodCategory,prodImage,prodPrice,prodStock} = req.body;
        
        await Product.findByIdAndUpdate(id,
            {
                prodName,
                prodDesc,
                prodCategory,
                prodImage,
                prodPrice,
                prodStock
            },
            {
                new:true
            })
        res.redirect("/products/products-list")
    } catch (error) {
        next (error);
    }
})

router.get('/edit', async(req,res,next) => {
    try {
        const products = await Product.find();
        res.render('products/products-edlist', {products});
    } catch (error) {
        next (error);
    }
})

router.get ('/:id', async (req,res, next) => {
    try {
       const {id} = req.params;
       const product = await Product.findById(id); 
       res.render ('products/product-details', product);
    }catch (error){
        next (error);
    }
})

router.post('/:id/delete', async (req,res,next) =>{
    try {
        const {id} = req.params;
        await Product.findByIdAndDelete(id);

        res.redirect('/products/product-list')
    } catch (error) {
        next(error);
    }
})

module.exports = router;