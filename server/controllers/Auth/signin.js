import { User } from "../../models/User.js";

import { createToken } from "../../utils/token.js";
import bcrypt from 'bcrypt';


const signin = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(200).json({
            success: false,
            message: "Email and password required"
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log("Please sign up first");

            return res.status(200).json({
                success: false,
                message: "Please signup first"
            })
        }


        const hashedPassword = user.password;
        if (! await bcrypt.compare(password, hashedPassword)) {

            console.log("Incorrect password");

            return res.status(200).json({
                success: false,
                message: "Incorrect password"
            })
        }

        user.password = undefined;
        const token = createToken(user);

        console.log("Login successfull");
        console.log("JWT token :", token);

        res.cookie("token", token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            }
        );
        return res.status(200).json({
            success: true,
            message: "Login successful",
        })
    }
    catch (err) {
        console.log("Login failed. Please try again later.");
        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}

export default signin;