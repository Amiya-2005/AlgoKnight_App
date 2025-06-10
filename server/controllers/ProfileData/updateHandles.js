import { Profile } from "../../models/Profile.js";
import { User } from "../../models/User.js";

const updateHandles = async (req, res) => {

    const { codeforces, codechef, leetcode } = req.body;
    const { user } = req;

    if (!user?.email) {
        return res.status(400).json({
            message: "Please login first",
            success: false,
        })
    }
    try {
        const coder = await User.findOne({email : user.email});
        if (!coder) {
            return res.status(200).json({
                message: "User does not exist",
                success: false,
            })
        }

        const profile = await Profile.findById(coder.profile);

        coder.handlesUpdated = true; //current data to be flushed at next batch updates
        coder.submissions.lastUpdated = new Date(0);

        profile.codeforces.handle = codeforces;
        profile.codechef.handle = codechef;
        profile.leetcode.handle = leetcode;

        await coder.save();
        await profile.save();

        console.log("User handles updated successfully");

        return res.status(200).json({
            success: true,
            message: "Handles updated successfully."
        })

    }
    catch (err) {

        console.error("Handle update failed", err);

        return res.status(500).json({
            success: false,
            message: "Handle update failed. Please try again later"
        })

    }
}

export default updateHandles;