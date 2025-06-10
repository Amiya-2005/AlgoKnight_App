import { Profile } from "../../models/Profile.js";
import { User } from "../../models/User.js";

export const getUpsolve = async (req, res) => {
    const { user } = req;

    if (!user?.email) {
        console.log("Login required");
        
        return res.status(400).json({
            message: "Please login to continue",
            success: false,
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const profile = await Profile.findById(coder.profile);

        let cf = profile.codeforces.contests.slice(-5);
        let cc = profile.codechef.contests.slice(-5);
        let lc = profile.leetcode.contests.slice(-5);


        cf = cf.map(contest => ({...contest._doc, platform : 'codeforces'}))     //...contest spreads the whole mongoDB object (just need to spread the _doc (Data)) 
        cc = cc.map(contest => ({...contest._doc, platform : 'codechef'}))
        lc = lc.map(contest => ({...contest._doc, platform : 'leetcode'}))

        let recent_contests = [...cf, ...cc, ...lc];
        recent_contests.sort((a, b) => a.date - b.date); //ascending order of dates

        recent_contests = recent_contests.splice(-5); //Latest 5

        console.log("Upsolve contests fetched successfully");
        return res.status(200).json({
            recent_contests,
            message: "Upsolve contests fetched successfully",
            success: true
        });
    } catch (error) {
        console.log("Could not fetch upsolve contests");
        return res.status(500).json({
            message: "Could not fetch upsolve contests",
            success: false
        });
    }
}

export const getFavorites = async (req, res) => {
    const { user } = req;

    if (!user?.email) {
        console.log("Login required");

        return res.status(400).json({
            message: "Please login to continue",
            success: false,
        })
    }
    try {
        const coder = await User.findOne({ email: user.email });
        console.log("Favorite contests fetched successfully");

        return res.status(200).json({
            favorites: coder.favoriteContests,
            message: "Favorite contests fetched successfully",
            success : true,
        });

    } catch (error) {
        console.log("Could not fetch favorite contests")
        return res.status(500).json({
            message: "Could not fetch favorite contests",
            success: false
        });
    }
}

export const addToFavorite = async (req, res) => {
    const { user } = req;
    const { name, url, platform, short_note } = req.body;

    if (!user?.email) {
        console.log("Login required");

        return res.status(400).json({
            message: "Please login to continue",
            success: false,
        })
    }
    try {
        const coder = await User.findOne({ email: user.email });

        const favs = coder.favoriteContests;

        if (favs.some(fav => fav.url === url)) {
            console.log("Contest already added into favorites");
            return res.status(200).json({
                message: "Contest already added into favorites",
                success: false,
            })
        }

        favs.push({ name, url, platform, short_note });

        await coder.save();
        console.log("Added into favorites successfully")

        return res.status(200).json({
            message: "Added into favorites successfully",
            success: true,
        })

    } catch (error) {
        console.log("Could not add contest to favorites")
        return res.status(500).json({
            message: "Could not add contest to favorites",
            success: false
        });
    }
}

export const removeFromFavorite = async (req,res) => {
    const { user } = req;
    const { url } = req.body;

    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false,
        })
    }
    try {
        const coder = await User.findOne({ email: user.email });

        let favs = coder.favoriteContests;

        if ( ! favs.some(fav => fav.url === url)) {
            console.log("No fav contest found")
            return res.status(200).json({
                message: "No fav contest found",
                success: false,
            })
        }

        const index = favs.findIndex(fav => fav.url === url);

        favs = favs.splice(index, 1); 

        await coder.save();
        console.log("Removed from favorites successfully");

        return res.status(200).json({
            message: "Removed from favorites successfully",
            success: true,
        })

    } catch (error) {
        console.log("Could not remove contest from favorites");
        return res.status(500).json({
            message: "Could not remove contest from favorites",
            success: false
        });
    }
}