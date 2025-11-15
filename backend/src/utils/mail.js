import Mailgen from "mailgen"
import nodemailer from "nodemailer"

// for sending emails these are all the options that i have to provide

const sendEmail = async(options) => {
    const mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "Project Manager",
            link: "www.projectmanager@example.com"
        }
    })

    const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)

    const emailHtml = mailGenerator.generate(options.mailgenContent)

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: process.env.MAILTRAP_SMTP_PORT,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS
        }
    })

    const mail = {
        from: "mail.projectmanager@example.com",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    }

    try {
        await transporter.sendMail(mail)
    } catch (error) {
        console.error("Email service failed silently. Make sure that you have entered correct MAILTRAP credentials in the .env file")
        console.error("Error: ",error)
    }
}

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "Welcome to our App! we are glad to have you on board.",
            action:{
                instructions: "To verify your email please click on the following button",
                button:{
                    color: "#22BC66",
                    text: "Verify your email",
                    link: verificationUrl
                },
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}


const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "We got a request to reset the password of your account",
            action: {
                button: {
                    color: "#5C5CFF",
                    text: "Reset your password",
                    link: passwordResetUrl
                }
            },
            outro: "Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
}

export{
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent
}