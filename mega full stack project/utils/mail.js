import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "",
    },
  });
  // Generate an HTML email with the provided contents
  var emailBody = mailGenerator.generate(options.mailGenContent);

  // Generate the plaintext version of the e-mail (for clients that do not support HTML)
  var emailText = mailGenerator.generatePlaintext(options.mailGenContent);

  var transport = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: process.env.MAILTRAP_PORT,
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD
    }
  });

  await transport.sendMail({
    from: process.env.MAILTRAP_MAIL, // sender address
    to: options.email, // list of receivers
    subject: options.subject, // Subject line
    html: emailBody,
    text: emailText,
  });
};

// a factory function that will return a body object

const emailVerificationMailGenContent = (username, verificationURL) => {
  return {
    body: {
      name: username,
      intro: `Welcome to our task Manager User ${username}`,
      action: {
        instruction: "Click on below link to verify your email: ",
        button: {
          color: "#22BC66", // optional
          text: "Confirm your account",
          link: verificationURL,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

// sendMail({
//     email: User.email,
//     subject: "aaa",
//     mailGenContent: emailVerificationMailGenContent(
//         username,
//         customURL
//     )
// });
