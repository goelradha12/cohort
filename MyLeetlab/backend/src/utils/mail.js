import Mailgen from "mailgen";
import { Resend } from "resend";
import { apiError } from "./api.error.js";

// Resend client is created lazily (on first send) rather than at import time.
// This avoids two problems:
//  1. The Resend constructor throws if the API key is missing; constructing it at
//     import time would crash the whole app on startup even for non-email routes.
//  2. dotenv.config() runs after ES module imports are evaluated, so reading the
//     key at import time would see it as undefined even when .env has it.
let resendClient = null;
const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new apiError(500, "Email is not configured (RESEND_API_KEY missing)");
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
};

export const sendMail = async (options) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Cook the Code",
      link: "testlink",
    },
  });
  // Mailgen still generates the email HTML from the provided content.
  var emailBody = mailGenerator.generate(options.mailGenContent);

  // Resend sends the Mailgen-generated HTML.
  const resend = getResendClient();
  const { data, error } = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: [options.email],
    subject: options.subject,
    html: emailBody,
  });

  if (error) {
    console.error("Email send failed", {
      to: options.email,
      subject: options.subject,
      name: error?.name,
      message: error?.message,
    });
    throw new apiError(502, "Failed to send email");
  }

  return data;
};

// a factory function that will return a body object

export const emailVerificationMailGenContent = (username, verificationURL, URLExpiry) => {
  return {
    body: {
      name: username,
      intro: `Click on below link before ${URLExpiry} to verify your email: `,
      action: {
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

export const forgotPasswordMailGenContent = (username, url, URLExpiry) => {
  return {
    body: {
      name: username,
      intro: `Click on the link to reset your password before ${URLExpiry}`,
      action: {
        button: {
          color: "#22BC66", // optional
          text: "Reset your Password",
          link: url,
        }
      },
      outro: "Not You? Someone might have mistakingly entered your mail. Please, Ignore the mail in such case."
    }
  }
}
// sendMail({
//     email: User.email,
//     subject: "aaa",
//     mailGenContent: emailVerificationMailGenContent(
//         username,
//         customURL
//     )
// });
