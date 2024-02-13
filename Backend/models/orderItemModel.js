const mongoose = require('mongoose');

// Define the schema for order items
const orderItemSchema = mongoose.Schema({
    quantity: {
        type: Number,
        required: true // Quantity is required
    },
    product: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Product model
        ref: 'Product' // Name of the referenced model
    }
});

// Create and export the OrderItem model based on the schema
exports.OrderItem = mongoose.model('OrderItem', orderItemSchema);
