import { User } from "../../models/User.js";
import { Profile } from "../../models/Profile.js";


const extractData = async (pid) => {      //Internal function used by the handler function
    const profile = await Profile.findById(pid);

    return {
        id: profile.user,
        fullName: profile.fullName,
        userName: profile.userName,
        handles: {
            codeforces: profile.codeforces.handle,
            codechef: profile.codechef.handle,
            leetcode: profile.leetcode.handle
        },
        ratings: {
            codeforces: profile.codeforces.contests.at(-1)?.rating ?? null,
            codechef: profile.codechef.contests.at(-1)?.rating ?? null,
            leetcode: profile.leetcode.contests.at(-1)?.rating ?? null,
        }
    }
}
export const getAllConnections = async (req, res) => {
    const { user } = req;

    if (!user?.email) {
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const userIds = coder.friends;

        const networkData = await Promise.all(
            userIds.map(async (uid) => {
                const user = await User.findById(uid);
                return extractData(user.profile)
            })
        )

        return res.status(200).json({
            networkData,
            success: true,
            message: "Network data fetched successfully"
        })
    }

    catch (error) {
        console.log("Could not fetch network data", error);
        return res.status(500).json({
            success: false,
            message: "Could not fetch network data"
        })
    }
}

export const searchUser = async (req, res) => {
    const { user } = req;
    const { searchQuery } = req.body;

    if (!user?.email) {
        return res.status(400).json({
            success: false,
            message: "Please login to continue"
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });
        const existingConnections = coder.friends.map(id => id.toString());

        const resultIds = (await Profile.find({
            $or : [
                {userName : { $regex: searchQuery, $options: 'i' }},
                {fullName : { $regex: searchQuery, $options: 'i' }},
                {'codeforces.handle' : { $regex: searchQuery, $options: 'i' }},
                {'codechef.handle' : { $regex: searchQuery, $options: 'i' }},
                {'leetcode.handle' : { $regex: searchQuery, $options: 'i' }},
            ]
        }).select('_id user')).filter(profile => !existingConnections.includes(profile.user.toString())).map(profile => profile._id);

        const searchResults = await Promise.all(resultIds.map((pid) => extractData(pid)))

        return res.status(200).json({
            searchResults,
            success: true,
            message: "Search result sent successfully"
        })
    }
    catch (error) {
        console.log("Could not fetch search result", error);
        return res.status(500).json({
            success: false,
            message: "Could not send search result"
        })
    }
}

