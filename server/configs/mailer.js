import nodemailer from 'nodemailer';
import { config } from 'dotenv';
config();


const transporter = nodemailer.createTransport({
    host : process.env.SMTP_HOST,
    secure : true,
    auth: {
        user: process.env.USER_NAME,
        pass: process.env.APP_PASS
    }
});


//called inside pre hook of user schema
const mailHandler = async(email, title, body) =>  {
    try{
        const info = await transporter.sendMail({
            from: `Admin AlgoKnight <${process.env.USER_NAME}>`, 
            to: email, 
            subject: title, 
            html: body, 
        });
        return info;
    }
    catch {
        throw new Error("Invalid user-email")
    }
}

export default mailHandler;