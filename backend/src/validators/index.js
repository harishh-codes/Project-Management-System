import { body } from "express-validator"

const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email cannot be empty")
            .isEmail()
            .withMessage("Please enter a valid email"),
        body("username")
            .trim()
            .notEmpty()
            .withMessage("Username is required")
            .isLength({min: 3})
            .withMessage("Username must be atleast 3 characters long"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password cannot be empty")
            .isLength({min: 3})
    ]
}

const userLoginValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email cannot be empty")
            .isEmail()
            .withMessage("Email is required"),
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required")
        ]
}

const userChangeCurrentPasswordValidator = () => {
    return []
}

const userForgotPasswordRequestValidator = () => {
    return [
        body("email")
        .trim()
        .notEmpty()
        .withMessage("Email cannot be empty")
        .isEmail()
        .withMessage("Please enter valid email")
    ]
}

const userResetForgotPasswordValidator = () => {
    return [
        body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("Password field cannot be empty"),
        body("confirmNewPassword")
        .trim()
        .notEmpty()
        .withMessage("Password field cannot be empty")
    ]
}

export {userRegisterValidator, userLoginValidator, userChangeCurrentPasswordValidator, userForgotPasswordRequestValidator, userResetForgotPasswordValidator}