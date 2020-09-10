import "source-map-support/register";
import * as AWS from "aws-sdk";

const SimpleEmailService = new AWS.SES();

type Email = {
  receiver: string;
  message: string;
  sender: string;
  subject: string;
  reply_to?: string;
};

export const sendEmail = async (event, _context, callback) => {
  const data: Email = JSON.parse(event.body);

  await sendSESEmail(data);

  const response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": [
        "https://hopkinsmarketing.org",
        "https://www.hopkinsmarketing.org",
      ],
      "Access-Control-Allow-Credentials": true,
    },
    body: JSON.stringify({
      message: "success",
    }),
  };
  callback(null, response);
};

function sendSESEmail(data: Email) {
  const emailParams = {
    Source: data.sender, // SES SENDING EMAIL
    Destination: {
      ToAddresses: [data.receiver], // SES RECEIVING EMAIL
      BccAddresses: [data.sender],
    },
    ReplyToAddresses: data.reply_to ? [data.reply_to] : undefined,
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: data.message,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: data.subject,
      },
    },
  };

  SimpleEmailService.sendEmail(emailParams, (err, data) => {
    return { err, data };
  });
}
