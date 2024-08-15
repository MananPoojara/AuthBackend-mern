// it's a controller file where we only controls what happen when the signup routes called

import { User } from '../model/user.model.js'
import bcrypt from 'bcryptjs'
import { genrateTokenAndSetToken } from '../utils/genrateTokenAndSetToken.js';



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

export const signin = async (req, res) => {
    res.send("it's Signin")
}

export const logout = async (req, res) => {
    res.send("it's logout")
}