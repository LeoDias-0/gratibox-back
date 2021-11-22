import connection from '../database/database.js'
import dayjs from 'dayjs'

const calculateNextDays = (today, type, dayToDeliver) => {
	let days = []
	today = dayjs(today)
	dayToDeliver = Number(dayToDeliver)
	if (type === 'Mensal') {

		const theoreticalFirstDay = today.set('date', dayToDeliver)

		console.log({ '': theoreticalFirstDay.format('DD/MM/YYYY') })

		let monthsToCheck = [
			theoreticalFirstDay,
			theoreticalFirstDay.add(1, 'month'),
			theoreticalFirstDay.add(2, 'month'),
			theoreticalFirstDay.add(3, 'month')
		]

		monthsToCheck = monthsToCheck.map(date => {
			console.log({ 'day week': date.day() })
			if (date.day() === 6) return date.add(2, 'day')
			if (date.day() === 0) return date.add(1, 'day')
			return date
		})
		if (today.date() > monthsToCheck[0].date()) {
			days = monthsToCheck.slice(1)
		} else {
			days = monthsToCheck.slice(0, 3)
		}

		return days.map(a => a.format('DD/MM/YYYY'))

	} else if (type === 'Semanal') {
		const next = dayToDeliver - today.day()

		days = [
			today.add(next, 'day'),
			today.add(next + 7, 'day'),
			today.add(next + 14, 'day')
		]

		return days.map(a => a.format('DD/MM/YYYY'))
	}

	return null
}

const getSignature = async (req, res) => {

	const { userId } = req

	try {

		const querySignature = await connection.query(`
			SELECT * FROM signatures WHERE user_id = $1;
		`, [userId])

		if (querySignature.rowCount === 0) return res.sendStatus(404)

		const signature = querySignature.rows[0]

		const nextDays = calculateNextDays(dayjs(), signature.type, signature.day_to_deliver)

		signature.first_day = nextDays[0]
		signature.second_day = nextDays[1]
		signature.third_day = nextDays[2]

		return res.status(200).send(signature)
	} catch (error) {
		return res.sendStatus(500)
	}
}

export default getSignature