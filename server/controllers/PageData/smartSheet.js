import mongoose from "mongoose";
import { User } from "../../models/User.js";
import { Problem } from "../../models/Problem.js";



export default async function (req, res) {
    const { user } = req;
    const { page = 1, limit = 20 } = req.query; 
    const start = (page - 1) * limit;           //page is 1-based but problems array is 0-based
    const end = page * limit - 1;
    let totalPages;

    console.log("Page : ", page, "Limit : ", limit);

    console.log("Smartsheet build requested");
    if (!user) {
        console.log("User not found (Smartsheet build requested)");

        return res.status(400).json({
            fullData: null,
            success: false,
            message: "Login required"
        })
    }
    try {
        const coder = await User.findOne({ email: user.email });

        let savedSheet = coder.smartsheet;

        if ((!savedSheet.lastUpdated) || (new Date(savedSheet.lastUpdated)).getTime() < Date.now() - 10 * 60 * 1000) {
            const data = await getFriendsSolvedProblems(coder._id);
            console.log("Sheet size : ", data.length);
            console.log("Smartsheet built successfully, valid till : ", (new Date(Date.now() + 10 * 60 * 1000)).toLocaleString());

            totalPages = Math.ceil(data.length / limit);
            savedSheet = data.slice(start, end + 1);

            coder.smartsheet = { sheet: data, lastUpdated: new Date() };
            await coder.save();
        }
        else {
            totalPages = Math.ceil(savedSheet.sheet.length / limit);
            console.log("Saved sheet size : ", savedSheet.sheet.length);
            console.log("Used cached sheet, expires at : ", (new Date(new Date(savedSheet.lastUpdated).getTime() + 10 * 60 * 1000)).toLocaleString());
            savedSheet = savedSheet.sheet.slice(start, end + 1);
        }

        const problemIds = savedSheet.map(item => item.task);

        const problems = await Problem.find({ _id: { $in: problemIds } });

        const problemMap = new Map(problems.map(p => [p._id.toString(), p]));

        const enrichedSheet = savedSheet.map(item => ({
            task: problemMap.get(item.task.toString()), // replace id with full problem
            count: item.count
        }));

        return res.status(200).json({
            smartSheet: enrichedSheet,
            success: true,
            message: "Smartsheet constructed successfully"
        })
    }
    catch (error) {
        console.log("Could not construct smartSheet : ", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}


async function getFriendsSolvedProblems(userId) {
    try {
        const pipeline = [
            // Step 1: Match the current user
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },

            // Step 2: Lookup friends and their submissions in one go
            {
                $lookup: {
                    from: "users",
                    let: { friendIds: "$friends" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$_id", "$$friendIds"] }
                            }
                        },
                        {
                            $project: {
                                submissions: 1
                            }
                        }
                    ],
                    as: "friendsData"
                }
            },

            // Step 3: Unwind and process submissions
            {
                $unwind: "$friendsData"
            },
            {
                $unwind: "$friendsData.submissions.data"
            },

            // Step 4: Group by task
            {
                $group: {
                    _id: "$friendsData.submissions.data.task",
                    count: { $sum: 1 },
                    userId: { $first: "$_id" }
                }
            },

            // Step 5: Lookup problems with solver check
            // {
            //     $lookup: {
            //         from: "problems",
            //         let: {
            //             taskId: "$_id",
            //             currentUserId: "$userId"
            //         },
            //         pipeline: [
            //             {
            //                 $match: {
            //                     $expr: {
            //                         $and: [
            //                             { $eq: ["$_id", "$$taskId"] },
            //                             { $not: { $in: ["$$currentUserId", "$solvers"] } }
            //                         ]
            //                     }
            //                 }
            //             }
            //         ],
            //         as: "problemData"
            //     }
            // },

            // // Step 6: Filter out problems already solved by user (problem id comes in the field 'problemData' only for the unsolved tasks of the user)
            // {
            //     $match: {
            //         "problemData": { $ne: [] }
            //     }
            // },

            // Step 7: Final projection
            {
                $project: {
                    task: "$_id",
                    count: 1,
                    _id: 0
                }
            },

            // Step 8: Sort and limit
            {
                $sort: { count: -1 }
            },
            {
                $limit: 200
            }
        ];

        const result = await User.aggregate(pipeline);
        return result;

    } catch (error) {
        console.error('Error fetching friends solved problems with pagination (optimized):', error);
        throw error;
    }
}