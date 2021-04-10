//This is a file i will run on its own any time
const mongoose = require('mongoose');
// to import from product.js
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmStand2', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO ERROR!!!!")
        console.log(err)
    })

// Dưới này là để thử nghiệm cho một sản phẩm cho Product thôi
// const p = new Product({
//     name: 'ruby grapefruit',
//     price: 1.99,
//     categoriy: 'fruit'
// })

// p.save()
//     .then(p => console.log(p))
//     .catch(e => console.log(e))

// nếu một mục fail validation trong products.js thì tất cả sẽ không thể insert vào Product ở dưới đây được
const seedProducts = [{
        name: 'Fairy Eggplant',
        price: 1.00,
        category: 'vegetable'
    },
    {
        name: 'Organic Goddess Melon',
        price: 4.99,
        category: 'fruit'
    },
    {
        name: 'Organic Mini Seedless Watermelon',
        price: 3.99,
        category: 'fruit'
    },
    {
        name: 'Organic Celery',
        price: 1.50,
        category: 'vegetable'
    },
    {
        name: 'Chocolate Whole Milk',
        price: 2.69,
        category: 'dairy'
    },
]

// rồi cho vào Model "Product"
Product.insertMany(seedProducts)
    .then(res => console.log(res))
    .catch(e => console.log(e))