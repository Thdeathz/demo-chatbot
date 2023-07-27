import express from 'express'
import { resolveImage } from '~/controllers/detect.contoller'

const router = express.Router()

router.route('/').post(resolveImage)

export default router
