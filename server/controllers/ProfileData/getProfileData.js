import { Profile } from "../../models/Profile.js";
import { User } from "../../models/User.js";

const getProfileData = async (req, res) => {
    const { user } = req;
    if (!user?.email) {
        return res.status(400).json({
            message: "Please login first",
            success: false,
        })
    }
    try {
        const coder = await User.findOne({ email: user.email })
        if (!coder) {
            return res.status(200).json({
                message: "User does not exist",
                success: false,
            })
        }
        const profile = await Profile.findById(coder.profile);

        console.log("Profile fetched successfully");

        const cf = profile.codeforces;
        const cc = profile.codechef;
        const lc = profile.leetcode;

        const profileData = {
            personal: {
                email: coder.email,
                userName: profile.userName,
                fullName: profile.fullName,
                bio: profile.bio,
                university: profile.university,
                yearOfStudy: profile.yearOfStudy,
            },
            handles: {
                codeforces: cf.handle,
                codechef: cc.handle,
                leetcode: lc.handle,
            },
            quickStats: {
                totalProblemsSolved: cf.solved + cc.solved + lc.solved,
                totalContestsAppeared: cf.contests.length + cc.contests.length + lc.contests.length,
                averageRating:
                    Math.floor(((cf.contests.length > 0 ? cf.contests.at(- 1).rating : 0) +
                    (cc.contests.length > 0 ? cc.contests.at(- 1).rating : 0) +
                    (lc.contests.length > 0 ? lc.contests.at(- 1).rating : 0)) / 3)
            }
        }

        return res.status(200).json({
            profileData,
            message: "Profile Data fetched successfully",
            success: true,
        })

    } catch (error) {
        console.log("Profile fetch failed");
        return res.status(500).json({
            message: "Server error",
            success: false,
        })
    }
}

export default getProfileData