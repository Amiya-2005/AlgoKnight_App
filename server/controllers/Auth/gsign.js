import { User } from "../../models/User.js";
import { Profile } from "../../models/Profile.js";
import { createToken } from "../../utils/token.js";

const gsign = async (req, res) => {
    const { fullName, userName, email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            const profile = await Profile.create({fullName, userName});
            user = await User.create({
                email,
                password: 100000 + Math.floor(Math.random() * 900000), //6 digit random number
                profile: profile._id
            })
            profile.user = user._id;
            await profile.save();
        }

        user.password = undefined;
        const token = createToken(user);

        res.cookie("token", token,
            {
                httpOnly: true,
                secure: true,
                sameSite: 'None'
            }
        );
        return res.status(200).json({
            success: true,
            message: "Sign In successful",
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server error",
        })
    }
}

export default gsign;