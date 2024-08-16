import { VERIFICATION_EMAIL_TEMPLATE } from "../mailtrap/emailTemplates.js";
import { mailtrapClient, sender } from "./mailtrap.conf.js";

export const sendverifictionemail = async (email, verificationToken) => {
    const recipients = [{ email }];
    try {
        const response = await mailtrapClient.send(
            {
                from: sender,
                to: recipients,
                subject: "Verify yout email",
                html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
                category: "Email Verification",
            }
        );
        console.log("success", response)
    } catch (error) {
        throw new Error(`Error ${error}`)
    }
}


export const sendWelcomEmail = async (email, name) => {
    const recipients = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipients,
            template_uuid: "530df7c7-8d55-41f8-97a4-d47b812a6bb2",
            template_variables: {
                "name": name
            },
        })
        console.log(`Email Successfully sended ${response}`);
    } catch (error) {
        console.log(error);
    }
}