
import '../src/setup.js'
import app from '../src/app.js'
import supertest from 'supertest'
import connection from '../src/database/database.js'

beforeEach(async () => {
	await connection.query(`DELETE FROM sessions;`)
	await connection.query(`DELETE FROM users;`)
})

afterAll(() => {
	connection.end()
})

describe('POST /sign-up', () => {
	it('returns 200 for valid params', async () => {
		const body = {
			email: 'teste@gmail.com',
			name: 'Irmão do Jorel',
			password: 'senhadifícil123'
		}

		const result = await supertest(app).post('/sign-up').send(body)
		const status = result.status

		expect(status).toEqual(200)
	})

	it('returns 422 for invalid password', async () => {
		const body = {
			email: 'teste@gmail.com',
			name: 'Irmão do Jorel',
			password: '12'
		}

		const result = await supertest(app).post('/sign-up').send(body)
		const status = result.status

		expect(status).toEqual(422)
	})

	it('returns 422 for invalid name', async () => {
		const body = {
			email: 'teste@gmail.com',
			name: '',
			password: 'senha123'
		}

		const result = await supertest(app).post('/sign-up').send(body)
		const status = result.status

		expect(status).toEqual(422)
	})

	it('returns 403 for repeated email', async () => {
		const body = {
			email: 'teste@gmail.com',
			name: 'nome teste',
			password: 'senha123'
		}

		await supertest(app).post('/sign-up').send(body)

		const result = await supertest(app).post('/sign-up').send(body)
		const status = result.status

		expect(status).toEqual(403)
	})
})