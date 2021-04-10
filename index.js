const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const AppError = require('./AppError');

mongoose.connect('mongodb://localhost:27017/farmStand2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

// to import from product.js
const Product = require('./models/product');

// set up ejs, look at views folder
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// tell express to use middleware
app.use(express.urlencoded({ extended: true }))
    // MIDDLEWARE!!!!!!!!!!!!!
app.use(methodOverride('_method'))

const categories = ['fruits', 'vegetable', 'dairy', 'fungi', 'baked goods'];

// first route!!
// because it takes time, so use async...await
app.get('/products', async(req, res) => {
    const { category } = req.query;
    // nếu có category query string thì:
    if (category) {
        const products = await Product.find({ category })
        res.render('products/index', { products, category })
    } else {
        const products = await Product.find({})
        res.render('products/index', { products, category: 'All' })
            // cho {products} argument vào để dùng ở ejs
    }
})

// Create new product!!!
app.get('/products/new', (req, res) => {
        // throw new AppError('NOT ALLOWED', 401);
        res.render('products/new', { categories })
    })
    // Create a route to submit to
app.post('/products', async(req, res, next) => {
    try {
        // have to tell express to use middleware app.use(express.urlencoded....)
        // console.log(req.body);
        // => { name: 'cucumber', price: '2', category: 'fruit' }
        const newProduct = new Product(req.body);
        await newProduct.save();
        // console.log(newProduct)
        // res.redirect on post, delete, update request
        res.redirect(`/products/${newProduct._id}`)
            // => {
            //     _id: 605879e5f1907759f4246fa6,
            //     name: 'Green Heirloom Tomato',
            //     price: 1,
            //     category: 'vegetable',
            //     __v: 0
            //    }
    } catch (e) {
        next(e);
    }
})


// Product details!!
// Sử dụng id thay vì tên vì không URL friendly (có cách SLUG, nhưng bây h chưa cần làm)
app.get('/products/:id', async(req, res, next) => {
    const { id } = req.params;
    // hoặc Product.findOne({_id:id})
    const product = await Product.findById(id)
        // console.log(product);
        // res.send('details page!')
    if (!product) {
        next(new AppError('Product Not Found', 404));
    }
    res.render('products/show', { product })
})

// UPDATE PRODUCTS
// need the id to know what to edit & to prepopulate the form
app.get('/products/:id/edit', async(req, res, next) => {
        const { id } = req.params;
        // phải lấy id từ query xuống đây, nếu k sẽ bị "UnhandledPromiseRejectionWarning: ReferenceError: id is not defined"
        const product = await Product.findById(id);
        if (!product) {
            next(new AppError('Product Not Found', 404));
        }
        res.render('products/edit', { product, categories })
    })
    // create an endpoint to submit (PUT hay là PATCH?)
app.put('/products/:id', async(req, res) => {
    // from a form, we cant make a PUT request, so out edit form is going to be a POST request
    const { id } = req.params;
    // validator is off be default, và new:true là để return modified document
    const product = await Product.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    // console.log(req.body)
    // res.send('PUT!!!')
    res.redirect(`/products/${product._id}`);
    // redirect to show route
    // dùng product._id thay vì id lấy từ req.params là vì product._id sẽ work khi mà product được lấy thành công từ Update => cho nên phải await Product.findByIdAndUpdate
})

// DELETE route
app.delete('/products/:id', async(req, res) => {
    // res.send("YOU MADE IT!")
    const { id } = req.params;
    const deletedProduct = await Product.findByIdAndDelete(id);
    res.redirect('/products')
})

app.use((err, req, res, next) => {
    const { status = 500, message = 'Something went wrong' } = err;
    res.status(status).send(message);
})

app.listen(3000, () => {
    console.log('APP IS LISTENING ON PORT 3000')
})