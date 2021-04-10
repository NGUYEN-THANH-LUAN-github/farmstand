const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        lowercase: true,
        // enum: ['fruit', 'vegetable', 'dairy', 'baked goods', 'fungi']
    }
})

// cái này sẽ thành "products" collection trong database
const Product = mongoose.model('Product', productSchema);

// chú ý: exports chứ k phải export
module.exports = Product;