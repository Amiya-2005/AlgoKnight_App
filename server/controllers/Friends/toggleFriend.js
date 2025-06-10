import { User } from "../../models/User.js";

const toggleFriend = async (req, res) => {

    const { friend_id } = req.body;
    const { user } = req;

    try {
        //user's full obj
        const coder = await User.findOne({ email: user.email });
        if (!coder) {
            console.log("Unauthorised user");

            return res.status(400).json({
                success: false,
                message: "Please sign in first"
            })
        }
        const friend = await User.findById(friend_id);

        if (!friend) {
            console.log("Friend does not exist in db");

            return res.status(200).json({
                success: false,
                message: "Friend does not exist in db"
            })
        }

        let index = coder.friends.indexOf(friend_id);

        if (index == -1) coder.friends.push(friend._id);

        else coder.friends.splice(index, 1);

        await coder.save();

        return res.status(200).json({
            success: true,
            message: "Friend Connection toggled successfully"
        })
    }
    catch (err) {

        console.error("Could not toggle in friend list", err);

        return res.status(500).json({
            success: false,
            message: "Server Error. Please try again later"
        })
    }
}

export default toggleFriend;