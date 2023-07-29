import { client } from '~/config/GoogleServiceAccountKey'
import Jimp from 'jimp'

export const detectImage = async (image: string | Buffer) => {
  const [result] = await client.landmarkDetection(image)

  if (!result || !result.landmarkAnnotations || result.landmarkAnnotations?.length === 0) {
    return 'No landmarks found'
  }

  return result.landmarkAnnotations[0].description
}

export const detectObject = async (image: Buffer) => {
  if (!client.objectLocalization) return 'No image provided'

  const [result] = await client.objectLocalization(image)

  if (
    !result ||
    !result.localizedObjectAnnotations ||
    result.localizedObjectAnnotations?.length === 0
  ) {
    return 'No objects found'
  }

  const loadedImage = await Jimp.read(image)
  const imageWidth = loadedImage.getWidth()
  const imageHeight = loadedImage.getHeight()

  const detectedPathLabel = await Promise.all(
    result.localizedObjectAnnotations.map(async (object, index) => {
      const objectData = object as any
      const topX = imageWidth * objectData.boundingPoly.normalizedVertices[0].x
      const topY = imageHeight * objectData.boundingPoly.normalizedVertices[0].y
      const width = imageWidth * objectData.boundingPoly.normalizedVertices[1].x - topX
      const height = imageHeight * objectData.boundingPoly.normalizedVertices[2].y - topY

      const cropedPath = await loadedImage
        .clone()
        .crop(topX, topY, width, height)
        .getBufferAsync(Jimp.MIME_BMP)

      const [labelDetect] = await client.labelDetection(cropedPath)
      const [propertiesDetect] = await client.imageProperties(cropedPath)

      return {
        id: index,
        name: objectData.name,
        score: objectData.score,
        image: cropedPath,
        labels: labelDetect.labelAnnotations,
        colors: propertiesDetect.imagePropertiesAnnotation?.dominantColors?.colors
      }
    })
  )

  return detectedPathLabel
}
