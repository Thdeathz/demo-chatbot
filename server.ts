import express from 'express'
import dotenv from 'dotenv'
import path from 'path'
import bodyParser from 'body-parser'
import { verifyRequestSignature } from '~/middleware/verifyRequest'
import rootRoute from '~/routes/root.route'
import notFoundRoute from '~/routes/404.route'
import chatbotRoute from '~/routes/chatbot.route'
import getStartedRoute from '~/routes/getStarted.route'

dotenv.config()
const app = express()
const PORT: string | 3500 = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

/* MIDDLEWARE */
app.use(express.json())
app.use(bodyParser.json())
verifyRequestSignature

/* CONFIG */
app.use('/', express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

/* ROUTES */
app.use('/', rootRoute)
app.use('/setup-profile', getStartedRoute)
app.use('/webhook', chatbotRoute)
app.use('*', notFoundRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
