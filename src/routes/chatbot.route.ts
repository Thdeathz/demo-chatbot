import express from 'express'
import { getWebhook, postWebhook } from '~/controllers/chatbot.controller'

const router = express.Router()

router.route('/').get(getWebhook).post(postWebhook)

export default router
