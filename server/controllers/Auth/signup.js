import { Profile } from "../../models/Profile.js";
import {User} from "../../models/User.js";

const signup = async (req, res) => {

    const { userName, email, password } = req.body;
    
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log("Email already registered before");

            return res.status(200).json({
                success: false,
                message: "Email already registered before"
            })
        }
        else{
            const profile = await Profile.create({fullName : userName, userName});
            const user = await User.create({
                email,
                password,          //hashing is to be done in pre hook of User.js
                profile : profile._id
            });

            profile.user = user._id;
            profile.save();

            console.log("Registered successfully", user);

            return res.status(200).json({
                success: true,
                message: "Registered successfully"
            })
        }
    }
    catch (err) {
        if(err.message && err.message.includes("Invalid user-email")){
            console.error("Email address is invalid", err);

            return res.status(200).json({
                success: false,
                message: "Email address is invalid"
            })
        }
        else{
            console.error("Register failed. Please try again later.", err);

            return res.status(500).json({
                success: false,
                message: "Server error"
            })
        }
    }
}

export default signup;