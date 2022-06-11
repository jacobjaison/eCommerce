const Category = require('../models/Category.model');
const router = require('express').Router();

router.get('/category-list', async(req,res,next) => {
    try {
        const categories = await Category.find();
        res.render('category/category-list', {categories});
    } catch (error) {
        next (error);
    }
})

router.get('/create', async (req, res, next) => {
    try {
        res.render('category/category-create')
    } catch (error) {
        next (error)
    }
})

router.post('/create', async (req,res,next) => {
    try {
        const {catName, catDesc} = req.body;
        await Category.create ({
            catName,
            catDesc,           
        });
        res.redirect('/category/category-list');
    } catch (error) {
        next (error)
    }
})

router.get('/:id/edit', async (req, res, next) => {
    try {
        const {id} = req.params;
        let category = await Category.findById(id);

        res.render('category/category-edit', category);
    } catch (error) {
        next (error)
    }
})

router.post('/:id/edit', async (req,res,next) => {
    try {
        const {id} = req.params;
        const {catName, catDesc} = req.body;
        
        await Category.findByIdAndUpdate(id,
            {
                catName,
                catDesc,                
            },
            {
                new:true
            })
        res.redirect("/category/category-list")
    } catch (error) {
        next (error);
    }
})

router.post('/:id/delete', async (req,res,next) =>{
    try {
        const {id} = req.params;
        await Category.findByIdAndDelete(id);

        res.redirect('/category/category-list')
    } catch (error) {
        next(error);
    }
})







module.exports = router;