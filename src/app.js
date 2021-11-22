import cors from 'cors'
import express from 'express'
import signIn from './controllers/signIn.js'
import signUp from './controllers/signUp.js'
import getSignature from './controllers/getSignature.js'
import auth from './middlewares/auth.js'
import postSignature from './controllers/postSignature.js'

const app = express()

app.use(express.json())
app.use(cors())

app.post('/sign-in', signIn)
app.post('/sign-up', signUp)
app.get('/my-signature', auth, getSignature)
app.post('/sign-plan', auth, postSignature)

export default app