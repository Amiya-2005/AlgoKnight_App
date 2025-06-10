import { User } from "../../models/User.js";

export const getAllStumbles = async (req, res) => {
    const { user } = req;
    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    console.log("Request received");

    try {
        const coder = await User.findOne({ email: user.email });

        const allStumbles = coder.stumbles;

        console.log("All stumbles delivered successfully");

        return res.status(200).json({
            allStumbles,
            message: "All stumbles delivered successfully",
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: "Stumbles fetch failed",
            success: false,
        })
    }
}

export const addStumble = async (req, res) => {
    const { user } = req;
    const problem_details = req.body;

    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    console.log(problem_details);

    try {
        const coder = await User.findOne({ email: user.email });

        const allStumbles = coder.stumbles;

        allStumbles.push(problem_details);

        await coder.save();

        console.log("New stumble added successfully");

        return res.status(200).json({
            message: "New stumble added successfully",
            success: true,
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Stumble addition failed",
            success: false,
        })
    }
}

export const removeStumble = async (req, res) => {
    const { user } = req;
    const {index} = req.body;

    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const allStumbles = coder.stumbles;

        allStumbles.splice(index, 1);

        await coder.save();

        console.log("Stumble removed successfully");

        return res.status(200).json({
            message: "Stumble removed successfully",
            success: true,
        })
    }
    catch(error){
        return res.status(500).json({
            message: "Stumble removal failed",
            success: false,
        })
    }
}

