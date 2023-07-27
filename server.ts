import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
import bodyParser from 'body-parser'
import multer from 'multer'
import corsOptions from '~/config/corsOption'
import storageImagePrefix from '~/config/storageImage'
import { verifyRequestSignature } from '~/middleware/verifyRequest'
import rootRoute from '~/routes/root.route'
import notFoundRoute from '~/routes/404.route'
import chatbotRoute from '~/routes/chatbot.route'
import getStartedRoute from '~/routes/getStarted.route'
import detectRoute from '~/routes/detect.route'

dotenv.config()
const app = express()
const PORT: string | 3500 = process.env.PORT || 3500
// const storage = multer.diskStorage(storageImagePrefix)
const upload = multer()

console.log(process.env.NODE_ENV)

/* MIDDLEWARE */
app.use(express.json())
app.use(cors(corsOptions))
verifyRequestSignature

/* CONFIG */
app.use('/', express.static(path.join(__dirname, 'public')))
app.use(bodyParser.json({ limit: '30mb' }))
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }))
app.set('view engine', 'ejs')

/* ROUTES */
app.use('/', rootRoute)
app.use('/setup-profile', getStartedRoute)
app.use('/webhook', chatbotRoute)
app.use('/detect', upload.single('image'), detectRoute)
app.use('*', notFoundRoute)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
