// it's a controller file where we only controls what happen when the signup routes called

import { User } from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { genrateTokenAndSetToken } from '../utils/genrateTokenAndSetToken.js';
import { sendForgotpassword, sendResetPasswordEmail, sendWelcomEmail, sendverifictionemail } from '../mailtrap/emails.js';
import crypto, { hash } from 'crypto';


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

//Sign In Endpoint
//input validation
//generate JWT token and set cookie
//update last login date
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credintial" })
        }
        //we comparing password with hashed password 
        const ispasswordvalid = await bcrypt.compare(password, user.password);

        if (!ispasswordvalid) {
            return res.status(400).json({ success: false, message: "Invalid Password" });
        }
        genrateTokenAndSetToken(res, user._id);

        user.lastlogin = new Date();

        await user.save();

        res.status(200).json({
            success: true,
            message: "Logged In Successfully",
            user: {
                ...user._doc,
                password: undefined,
            },
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })

    }
}

//LogOut Endpoint  clearing cookies
export const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged Out Successfully" })
}


//Forgat password input email
//if account exist password reset link in email
//reset password we have token for resetting passwrd new pass -> confirm password
// the password update and also email is generate
export const forgotpassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User Not Found" })
        }

        //genrating token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpire = Date.now() + 1 * 60 * 60 * 1000

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = resetTokenExpire;

        await user.save();

        //send Email
        await sendForgotpassword(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

        res.status(200).json({ success: true, message: "Password Reset Link Sended To Email" })
    } catch (error) {
        console.log(error)
    }
}


// Reset Password Endpoint
// new passw
//confirm passw
//mail sended
export const resetpassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid Credintial" })
        }


        //update Password
        const hashedpass = await bcrypt.hash(password, 10);

        user.password = hashedpass;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();


        await sendResetPasswordEmail(user.email);
        res.status(200).json({ success: true, message: "Password Reset Successfully" })

    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: error.message })

    }
}