import connection from "../database/database.js"
import validateSignUpInfo from "../validations/validateSignUpInfo.js"
import bcrypt from 'bcrypt'


const signUp = async (req, res) => {
	const { name, email, password } = req.body

	const signUpIsNotValid = validateSignUpInfo.validate(req.body).error

	if (signUpIsNotValid) return res.status(422).send('Dados inválidos.')

	try {
		const usersWithThatEmail = await connection.query(`
            SELECT * FROM users WHERE email=$1;
        `, [email])

		const isEmailAlreadyRegistered = usersWithThatEmail.rowCount > 0

		if (isEmailAlreadyRegistered) return res.status(403).send('Email já cadastrado!')

		const hashed = bcrypt.hashSync(password, 10)

		await connection.query(`
			INSERT INTO users (name, email, password) VALUES ($1, $2, $3);
		`, [name, email, hashed])

		return res.sendStatus(200)

	} catch (error) {

		return res.sendStatus(500)
	}
}

export default signUp
