import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import { detectObject } from '~/utils/DetectImage'

export const resolveImage: RequestHandler = asyncHandler(async (req, res) => {
  const image = req.file?.buffer
  if (!image) {
    res.status(400).json({
      success: false,
      message: 'No image provided'
    })
    return
  }

  const result = await detectObject(image)

  res.status(200).json({
    success: true,
    message: 'Image detected',
    result
  })
})
