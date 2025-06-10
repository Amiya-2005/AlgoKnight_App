import { User } from "../../models/User.js";

export const getAllConcepts = async (req, res) => {
    const { user } = req;
    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const allConcepts = coder.concepts;

        console.log("All concepts delivered successfully");

        return res.status(200).json({
            allConcepts,
            message: "All concepts delivered successfully",
            success: true,
        })
    } catch (error) {
        console.log("Concepts fetch failed");

        return res.status(500).json({
            message: "Concepts fetch failed",
            success: false,
        })
    }
}

export const addConcept = async (req, res) => {
    const { user } = req;
    const concept_details = req.body;

    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const allConcepts = coder.concepts;

        allConcepts.push(concept_details);

        await coder.save();

        console.log("New concept added successfully");

        return res.status(200).json({
            message: "New concept added successfully",
            success: true,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Concept addition failed",
            success: false,
        })
    }
}
export const editConcept = async (req, res) => {
    const { user } = req;
    const { concept_details, index } = req.body;

    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const allConcepts = coder.concepts;

        allConcepts[index] = concept_details;

        await coder.save();

        console.log("Concept edited successfully");

        return res.status(200).json({
            message: "Concept edited successfully",
            success: true,
        })
    }
    catch (error) {
        console.log("Concept edit failed");
        return res.status(500).json({
            message: "Concept edit failed",
            success: false,
        })
    }
}

export const removeConcept = async (req, res) => {
    const { user } = req;
    const { index } = req.body;

    if (!user?.email) {
        console.log("Login required");
        return res.status(400).json({
            message: "Please login to continue",
            success: false
        })
    }

    try {
        const coder = await User.findOne({ email: user.email });

        const allConcepts = coder.concepts;

        allConcepts.splice(index, 1);

        await coder.save();

        console.log("Concept removed successfully");
        return res.status(200).json({
            message: "Concept removed successfully",
            success: true,
        })
    }
    catch (error) {
        return res.status(500).json({
            message: "Concept removal failed",
            success: false,
        })
    }
}

