import { Profile } from "../../models/Profile.js";
import { User } from "../../models/User.js";

const updateProfile = async (req, res) => {

    const { userName, fullName, bio, university, yearOfStudy } = req.body;
    const { user } = req;

    if (!user?.email) {
        return res.status(400).json({
            message: "Please login first",
            success: false,
        })
    }
    try {
        const profile = await Profile.findById(user.profileId);
        
        if (!profile) {
            return res.status(200).json({
                message: "User does not exist",
                success: false,
            })
        }

        profile.userName = userName
        profile.fullName = fullName;
        profile.bio = bio;
        profile.university = university;
        profile.yearOfStudy = yearOfStudy;

        await profile.save();

        console.log("User profile updated successfully");

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully"
        })

    }
    catch (err) {
        console.error("profile update failed", err);
        return res.status(500).json({
            message: "Server error",
            success: false,
        })

    }
}

export default updateProfile;