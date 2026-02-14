const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        //TODO:before uncommenting required and unique, make sure to handle existing data
        type: String,
       // required: [true, 'Category name is required'],
        trim: true,
        //unique: true
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Create slug from name before saving
categorySchema.pre('save', function(next) {
    this.slug = this.name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;