// const { format } = require('date-fns/esm');
const nodemailer = require('nodemailer');
const { config } = require('../config/secrets');

exports.SendingAnEmailForNewAction = async (data) => {

  console.log(data);
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: 'cars.finishproject@gmail.com',
        pass: config.email_pass
      }

    });



    const mailOptions = {
      from: 'cars.finishproject@gmail.com',
      to: data.tenant_name.email,
      subject: `עבור ${data.tenant_name.name} הודעה עבור הזמנה חדשה`,
      html: `שלום ${data.tenant_name.name},
        בוצעה עבורך בתאריך ${formatDate(data.date_created)} הזמנת רכב
        תאריך התחלה ${formatDate(data.pick_up_date)} בשעה ${data.pick_up_time} עד ${formatDate(data.return_date)} בשעה ${data.return_time}
        המייל נשלח אוטומטית אין להשיב למייל זה`,
        html:`
        <h1>שלום <span>${data.tenant_name.name}</span></h1>
        <p>בוצעה עבורך הזמנת רכב בתאריך: <span>${formatDate(data.date_created)}</span></p>
        <p>ההזמנה לתאריך: <span>${formatDate(data.pick_up_date)}</span> בשעה: <span>${data.pick_up_time}</span>
          <br/> עד: <span>${formatDate(data.return_date)}</span> בשעה: <span>${data.return_time}</span></p>
        <p>אני מודים לך שבחרת בחברתנו נשמח לראותך שוב </p>
        <p>לכל שאלה ניתן לפנות <a href="mailto:cars.finishproject@gmail.com">למייל</a></p>
        <br/>
        <strong>המייל נשלח אוטומטית אין להשיב למייל זה </strong>
        `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log(error);
  }
};


exports.SendingAnEmailForNewMission = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      pool: true,
      host: "smtp.gmail.com",
      port: 587,
      secure: true,
      auth: {
        user: 'cars.finishproject@gmail.com',
        pass: 'lddkxffuqflzjbaz'
      }
    });

    const mailOptions = {
      from: 'cars.finishproject@gmail.com',
      to: data.for_id.email,
      subject: `עבור ${data.for_id.name} משימה חדשה`,
      html: `
      <h1>שלום <span>${data.for_id.name}</span></h1>
    <p>יש לך <a href="https://carrs.netlify.app/" target="_blank">משימה חדשה</a></p>
    <p>תאריך לביצוע: <span>${data.time_to_do ? formatDate(data.time_to_do) : 'אין'}</span></p>
    <p>כותרת המשימה: <span>${data.title}</span></p>
    <p>דחיפות המשימה: <span>${data.importance}</span></p>
    <p>נוספה בתאריך: <span>${formatDate(data.Date_added)}</span></p>
    <strong >בהצלחה!</strong>
      `,
     
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log(error);
  }
};



function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${day}/${month}/${year}`;
}

