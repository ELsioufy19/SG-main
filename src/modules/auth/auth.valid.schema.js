import joi from "joi"
export const registerSchema = joi.object({
    userName: joi.string().min(3).max(20).required(),
    email: joi.string().email().lowercase().required(),
    password: joi.string().required(),
    confirmPass: joi.string().valid(joi.ref('password')).required()
}).required()

export const loginSchema = joi.object({
    email: joi.string().email().lowercase().required(),
    password: joi.string().required()
})

export const forgetSchema = joi.object({
    email: joi.string().email().lowercase().required()
})

export const resetSchema = joi.object({
    forgetCode: joi.string().min(6).required(),
    password: joi.string().required(),
    cPassword: joi.string().valid(joi.ref('password')).required()
})