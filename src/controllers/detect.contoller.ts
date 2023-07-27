import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'
import path from 'path'
import { detectImage } from '~/utils/DetectImage'

export const resolveImage: RequestHandler = asyncHandler(async (req, res) => {
  // const imageUrl = path.join(__dirname, '../../views/demo-image.jpg')
  const image = req.file?.buffer

  if (!image) {
    res.status(400).json({
      success: false,
      message: 'No image provided'
    })
    return
  }

  const result = await detectImage(image)

  res.status(200).json({
    success: true,
    message: 'Image detected',
    result
  })
})
