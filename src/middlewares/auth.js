import connection from '../database/database.js'


const auth = async (req, res, next) => {
	const { authorization } = req.headers
	const token = authorization?.replace('Bearer ', '')

	console.log('auth', { token })

	try {
		const userSessionPromise = await connection.query(`
			SELECT * FROM sessions WHERE token = $1;
    	`, [token])

		const userSession = userSessionPromise.rows[0]

		if (!userSession) return res.sendStatus(401)

		req.userId = userSession.user_id

	} catch (error) {
		console.log(error)
		return res.sendStatus(500)
	}

	next()
}


export default auth