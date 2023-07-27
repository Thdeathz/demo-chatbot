import { RequestHandler } from 'express'
import request from 'request'
import { handleMessage } from '~/utils/Chatbot'

const verifyToken = process.env.VERIFY_TOKEN
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

      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhookEvent.message) {
        handleMessage(senderPsid, webhookEvent.message)
      } else if (webhookEvent.postback) {
        // handlePostback(senderPsid, webhookEvent.postback)
      }
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
    if (mode === 'subscribe' && token === verifyToken) {
      // Respond with the challenge token from the request
      console.log('WEBHOOK_VERIFIED')
      res.status(200).send(challenge)
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
}

export const setUpProfile: RequestHandler = (req, res) => {
  // Construct the message body
  let requestBody = {
    get_started: {
      payload: 'GET_STARTED'
    },
    whitelisted_domains: [process.env.APP_DOMAIN]
  }

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: `https://graph.facebook.com/v14.0/me/messenger_profile?access_token=${pageAccessToken}`,
      qs: { access_token: pageAccessToken },
      method: 'POST',
      json: requestBody
    },
    (err, res, body) => {
      if (!err) {
        console.log('Gửi gì đó đuê ><!')
      } else {
        console.error('Unable to set up profile:' + err)
      }
    }
  )
}
