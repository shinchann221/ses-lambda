const nodemailer = require("nodemailer");


//edit this
const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASS
    }
});

const sendMail = async (message,subject) => {
    let res = false;
  
    const params = {
        to: process.env.TO_EMAIL,
        from: process.env.SENDER_EMAIL,
        subject: subject,
        text: message,
    };
  
    return new Promise((resolve, reject) => {
      transporter.sendMail(params,
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
    const { message , subject} = eventData
    const res = await sendMail(message,subject)
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