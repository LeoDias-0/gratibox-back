import validateSignInInfo from '../validations/validateSignInInfo.js'
import connection from '../database/database.js'
import bcrypt from 'bcrypt'
import { v4 as uuid } from 'uuid'


const signIn = async (req, res) => {
	const { email, password } = req.body

	const signInIsNotValid = validateSignInInfo.validate(req.body).error

	if (signInIsNotValid) return res.status(422).send('Dados inválidos.')

	try {
		const usersWithThatEmail = await connection.query(`
            SELECT * FROM users WHERE email=$1;
        `, [email])

		const isEmailAlreadyRegistered = usersWithThatEmail.rowCount > 0

		if (!isEmailAlreadyRegistered) return res.status(409).send('Email não cadastrado!')

		const { id: userId, name, password: hashedPassword } = usersWithThatEmail.rows[0]

		const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword)

		if (!isPasswordCorrect) return res.status(401).send('Email ou senha incorretos!')

		const token = uuid()

		await connection.query(`
            INSERT INTO sessions (user_id, token) VALUES ($1, $2);
        `, [userId, token])

		return res.status(200).send({ token, name })

	} catch (error) {
		return res.sendStatus(500)
	}
}

export default signIn