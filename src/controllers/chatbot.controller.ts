import { RequestHandler } from 'express'

const vieriFyToken = process.env.VERIFY_TOKEN
const pageAccessToken = process.env.PAGE_ACCESS_TOKEN

export const postWebhook: RequestHandler = (req, res) => {
  let body = req.body

  console.log(`\u{1F7EA} Received webhook:`)
  console.dir(body, { depth: null })

  // Send a 200 OK response if this is a page webhook

  if (body.object === 'page') {
    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED')

    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function (entry: any) {
      // Gets the body of the webhook event
      let webhookEvent = entry.messaging[0]
      console.log(`\u{1F7EA} Received webhook event:`)
      console.dir(webhookEvent, { depth: null })

      // Get the sender PSID
      let senderPsid = webhookEvent.sender.id
      console.log(`\u{1F7EA} Sender PSID: `, senderPsid)
    })
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
}

export const getWebhook: RequestHandler = (req, res) => {
  // Parse the query params
  let mode = req.query['hub.mode']
  let token = req.query['hub.verify_token']
  let challenge = req.query['hub.challenge']

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === 'subscribe' && token === vieriFyToken) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
}
