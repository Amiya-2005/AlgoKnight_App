//For piechart data -> relies upon database (No CF api for tag to count map)

import { Profile } from "../../models/Profile.js";

export default async function fullData (req, res) {
    try {
        const { user } = req;
        console.log("Dashboard data requested.");

        if (!user || !user.profileId) {
            console.log("User not found (Dashboard data requested)");

            return res.status(400).json({
                fullData: null,
                success: false,
                message: "Login required."
            })
        }

        const profile = await Profile.findById(user.profileId);

        if (!profile) {
            console.log("Profile does not exist (Dashboard data requested)");

            return res.status(200).json({
                fullData: null,
                success: false,
                message: "User profile not found."
            })
        }

        const cf = profile.codeforces;
        const cc = profile.codechef;
        const lc = profile.leetcode;

        const handles = {
            codeforces : cf.handle,
            codechef : cc.handle,
            leetcode : lc.handle,
        }
        const pieChartData = {
            codeforces : {
                categories : cf.categories,
                total : cf.total,
                solved : cf.solved,
            },
            codechef : {
                categories : cc.categories,
                total : cc.total,
                solved : cc.solved,
            },
            leetcode : {
                categories : lc.categories,
                total : lc.total,
                solved : lc.solved,
            },
        }
        const ratingData = {
            codeforces : cf.contests,
            codechef : cc.contests,
            leetcode : lc.contests,
        }
        const heatmapData = {
            codeforces : cf.heatmap,
            codechef : cc.heatmap,
            leetcode : lc.heatmap,
        }

        const dataPacket = {
            handles,
            pieChartData,
            ratingData,
            heatmapData
        }

        console.log("Dashboard data sent.");

        return res.status(200).json({
            fullData: dataPacket,
            success: true,
            message: "All data delivered successfully."
        })
    }
    catch (err) {
        console.log("Could not send dashboard data");
        console.error(err);
        return res.status(500).json({
            fullData: null,
            success: false,
            message: "Server error."
        })
    }
}