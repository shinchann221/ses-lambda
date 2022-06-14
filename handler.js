'use strict';
var aws = require('aws-sdk');
var ses = new aws.SES({ region: "ap-south-1" });

const sendMail = async (message) => {
  let res = false;

  var params = {
    Destination: {
        ToAddresses : ['connect@neemtreeagrico.in']
    },
    Message: {
        Body: {
            Html: { 
                Charset: "UTF-8",
                Data : message
            }
        },
        Subject: {
            Charset: "UTF-8",
            Data : 'Website Query || Contact Us'
        }
    },
    Source: process.env.SENDER_EMAIL
}

  return new Promise((resolve, reject) => {
    ses.sendEmail(params,
      function (err, data, res) {
        console.log('err', err)
        if (err) { reject(err); return }

        console.log('data', data)
        console.log('res', res)
        resolve(data);
        return
      });
  })
}

module.exports.mailer = async (event) => {
  const eventData = JSON.parse(event.body);
  const { message } = eventData
  // const message = `Request received from ${name} email: ${email}`
  const res = await sendMail(message)//then( res => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: `Your function executed successfully! with status ${res}`,
    }, null, 2),
  };
};
