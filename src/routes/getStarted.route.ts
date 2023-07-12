import express from 'express'
import { setUpProfile } from '~/controllers/chatbot.controller'

const router = express.Router()

router.route('/').post(setUpProfile)

export default router
