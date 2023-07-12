import { Request, RequestHandler } from 'express'
import crypto, { BinaryLike } from 'crypto'

export const verifyRequestSignature = (req: Request, buf: BinaryLike) => {
  const signature = req.headers['x-hub-signature-256']

  if (!signature) {
    console.warn(`Couldn't find "x-hub-signature-256" in headers.`)
  } else {
    const elements = (signature as string).split('=')
    const signatureHash = elements[1]
    const expectedHash = crypto
      .createHmac('sha256', process.env.APP_SECRET as string)
      .update(buf)
      .digest('hex')
    if (signatureHash != expectedHash) {
      throw new Error("Couldn't validate the request signature.")
    }
  }
}
