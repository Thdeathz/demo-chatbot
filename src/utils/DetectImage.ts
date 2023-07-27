import { client } from '~/config/GoogleServiceAccountKey'

export const detectImage = async (imageUrl: string | Buffer) => {
  let [result] = await client.landmarkDetection(imageUrl)

  if (!result || !result.landmarkAnnotations || result.landmarkAnnotations?.length === 0) {
    return 'No landmarks found'
  }

  return result.landmarkAnnotations[0].description
}
