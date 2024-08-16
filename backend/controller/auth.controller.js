// it's a controller file where we only controls what happen when the signup routes called

import { User } from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { genrateTokenAndSetToken } from '../utils/genrateTokenAndSetToken.js';
import { sendWelcomEmail, sendverifictionemail } from '../mailtrap/emails.js';


// Signup Endpoint
export const signup = async (req, res) => {
    const { email, name, password } = req.body;

    try {

        if (!email || !name || !password) {
            throw new Error("All fields Are Required");
        }

        const UserExist = await User.findOne({ email });
        if (UserExist) {
            return res.status(400).json({ message: "User Already Exist" });
        }
        console.log(UserExist);

        const hasedpassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hasedpassword,
            name,
            verificationToken,
            verificationExpire: Date.now() + 24 * 60 * 60 * 1000, //24hour


        })

        await user.save();

        //jwt
        genrateTokenAndSetToken(res, user._id)

        await sendverifictionemail(user.email, verificationToken)

        res.status(201).json(
            {
                success: true,
                message: "User Created Successfully",
                user: {
                    ...user._doc,
                    password: undefined,

                }
            })


    } catch (error) {
        res.status(400).json({ success: false, message: error.message })

    }

}

//Email Verification Endpoint
export const verifyemail = async (req, res) => {
    // - - - - - - for emailcode
    const { code } = req.body;
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationExpire: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Or Expired Verification code" })
        }

        user.verified = true;
        user.verificationToken = undefined;
        user.verificationExpire = undefined;
        await user.save();

        await sendWelcomEmail(user.email, user.name);
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            user: {
                ...user._doc,
                password: undefined,

            }
        })
    } catch (error) {
        console.log(error)
    }
}

export const signin = async (req, res) => {
    res.send("it's Signin")
}

//LogOut Endpoint 
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged Out Successfully" })
}