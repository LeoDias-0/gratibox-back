import joi from 'joi'


const validateSignUpInfo = joi.object({
	name: joi.string().min(3).max(60).required(),
	email: joi.string().email().max(60).required(),
	password: joi.string().min(6).max(60)
}).length(3)

export default validateSignUpInfo