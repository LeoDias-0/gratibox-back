import connection from '../database/database.js'


const postSignature = async (req, res) => {

	const { userId } = req

	console.log('body', { body: req.body })

	const {
		type,
		date,
		day_to_deliver,
		completeName,
		adress,
		cep,
		city,
		uf,
		products
	} = req.body

	try {

		const queryStr = `
		INSERT INTO signatures
		(user_id, type, date, day_to_deliver, complete_name, adress, cep, city, uf, tea, organic_produts, incense) VALUES
		($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
		`

		console.log({ queryStr })

		console.log({
			userId,
			type,
			date,
			day_to_deliver,
			completeName,
			adress,
			cep,
			city,
			uf,
			a: products[0],
			b: products[1],
			c: products[2]
		})

		const querySignature = await connection.query(queryStr, [
			userId,
			type,
			date,
			day_to_deliver,
			completeName,
			adress,
			cep,
			city,
			uf,
			products[0],
			products[1],
			products[2]
		])

		return res.sendStatus(200)
	} catch (error) {
		return res.sendStatus(505)
	}
}

export default postSignature