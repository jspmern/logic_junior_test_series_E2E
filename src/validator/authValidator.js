const { body } = require('express-validator');

const registerValidationRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('mobile').optional().isMobilePhone().withMessage('Invalid mobile number')
];

const loginValidationRules = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

const forgetPasswordValidationRule = [
    body('email').isEmail().withMessage('Please enter a valid email'),
    // body('captchaToken').notEmpty().withMessage('Captcha token is required') // validation disabled for now
];

const resetValidationRule = [
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
];

module.exports = {
    registerValidationRules,
    loginValidationRules,
    forgetPasswordValidationRule,
    resetValidationRule
};
