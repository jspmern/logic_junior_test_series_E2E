const { body,param } = require('express-validator');
const createCategoryValidationRule=[
    body('name').notEmpty().withMessage('Name is required').isString().withMessage('Name must be a string').isLength({min:3}).withMessage('Name must be at least 3 characters long'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
]
const updateCategoryValidationRule=[
    param('id').isMongoId().withMessage('Invalid category ID'),
    body('name').optional().isString().withMessage('Name must be a string').isLength({min:3}).withMessage('Name must be at least 3 characters long'),
    body('description').optional().isString().withMessage('Description must be a string'),
    body('isActive').optional().isBoolean().withMessage('isActive must be a boolean')
]
const deleteCategoryValidationRule=[
    param('id').isMongoId().withMessage('Invalid category ID')
]
module.exports={createCategoryValidationRule,updateCategoryValidationRule,deleteCategoryValidationRule}