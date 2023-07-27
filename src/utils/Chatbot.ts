import axios from 'axios'
import { detectImage } from './DetectImage'
import request from 'request'

const pageAccessToken = process.env.PAGE_ACCESS_TOKEN

export const handleMessage = async (senderPsid: string, receivedMessage: any) => {
  let response

  // Check if the message contains text
  if (receivedMessage.text) {
    // Create the payload for a basic text message
    response = {
      text: `Nhận được rồi nhá: \n'${receivedMessage.text}'.\n Gửi thử cái ảnh xem bro ><!`
    }
  } else if (receivedMessage.attachments) {
    // Gets the URL of the message attachment
    let attachmentUrl = receivedMessage.attachments[0].payload.url

    // Download the image from the Facebook URL
    const imageResponse = await axios.get(attachmentUrl, { responseType: 'arraybuffer' })
    const imageBuffer = Buffer.from(imageResponse.data, 'binary')

    const landmarks = await detectImage(imageBuffer)

    response = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: `${landmarks} :))?`,
              subtitle: 'Đúng hay sai.',
              image_url: attachmentUrl,
              buttons: [
                {
                  type: 'postback',
                  title: 'Chuẩn luôn!',
                  payload: 'yes'
                },
                {
                  type: 'postback',
                  title: 'Sai rồi ><!',
                  payload: 'no'
                }
              ]
            }
          ]
        }
      }
    }
  }

  // Sends the response message
  callSendAPI(senderPsid, response)
}

export const callSendAPI = (senderPsid: string, response: any) => {
  // Construct the message body
  let requestBody = {
    recipient: {
      id: senderPsid
    },
    message: response
  }

  // Send the HTTP request to the Messenger Platform
  request(
    {
      uri: 'https://graph.facebook.com/v14.0/me/messages',
      qs: { access_token: pageAccessToken },
      method: 'POST',
      json: requestBody
    },
    (err, res, body) => {
      if (!err) {
        console.log('Message sent!')
      } else {
        console.error('Unable to send message:' + err)
      }
    }
  )
}
