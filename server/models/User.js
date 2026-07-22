import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import mailHandler from "../configs/mailer.js";


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        reqired: true
    },
    submissions: {
        data: [{
            task: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
            },
            status: {
                type: String,   //AC, WA, TLE, MLE, RE, CE
                required: true,
            },
            time: {
                type: Date,
                required: true,
            }
        }],
        lastUpdated: {
            type: Date,
            required: true,
            default: new Date(0)
        }
    },
    smartsheet: {
        sheet: [{
            task: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Problem",
            },
            connectionsSolved: {
                type: Number,      //No of friends/connections who have solved this problem (informational, computed post-selection)
                required: true,
                default: 0,
            },
            matchedTopic: {
                type: String,      //human-readable weak topic this problem was picked for (null when built via fallback)
                default: null,
            },
            matchedTag: {
                type: String,      //exact DB tag string that was matched (null when built via fallback)
                default: null,
            },
        }],
        personalized: {
            type: Boolean,        //true when built from AI weak-topic weights, false when built via fallback
            default: false,
        },
        lastUpdated: {
            type: Date,
            required: true,
            default: new Date(0)
        }
    },
    aiAnalysis: {
        summary: {
            type: String,
            default: "",
        },
        strengths: {
            type: [String],
            default: [],
        },
        weakTopics: {
            type: [{
                topic: String,          //human-readable label, e.g. "Graph Traversal" - what's shown to the user
                reason: String,
                tags: {
                    type: [{
                        tag: String,     //exact DB tag string (letter-for-letter match to what was fed to the LLM) - used to filter problems
                        weight: Number,  //1 (minor) - 10 (critical), used as smartsheet priority weight for this specific tag
                    }],
                    default: [],
                },
            }],
            default: [],
        },
        ratingAnalysis: {
            codeforces: { trend: String, note: String },
            codechef: { trend: String, note: String },
            leetcode: { trend: String, note: String },
        },
        consistencyAnalysis: {
            note: { type: String, default: "" },
            recommendation: { type: String, default: "" },
        },
        keyPoints: {
            type: [String],
            default: [],
        },
        lastUpdated: {
            type: Date,
            default: null,
        }
    },
    notes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Note",
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    otp: {
        type: String,
        default: "000000"
    },
    favoriteContests: [{
        name: String,
        url: String,
        platform: String,
        short_note: String,
    }],
    stumbles: [{
        name: String,
        summary: String,
        url: String,
        platform: String,
        hint: String,
        intuition: String,
        status: String,
        solution: String   //link to submitted code or any file etc 
    }],
    concepts: [{
        title: String,
        description: String,
        notes: {
            basic: String,
            intermediate: String,
            advanced: String,
        },
        problemLinks: [String]     //Array of problem links
    }],
    handlesUpdated: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 10);
    }
    let { email } = user;

    if (user.isNew) {
        try {
            const title = "Welcome to AlgoKnight"
            const body = `<h1>Hi Coder !</h1> <h3>Delighted to begin the coding journey together</h3>`
            const mailContent = await mailHandler(email, title, body);
            console.log("Mailed content : ", mailContent);
            return next();
        }
        catch (err) {
            return next(err);
        }
    }

});

const msl = 200;
//Max 200 submissions will be stored 
//Don't worry tags of codeforces will be updated separately
//200+ array length slows down querying in mongoDB

userSchema.pre('save', function (next) {
    if (this.submissions.data.length > msl) {
        const removeCount = this.submissions.data.length - msl;
        this.submissions.data = this.submissions.data.sort((a, b) => a.time - b.time).slice(removeCount);
        //Keeps the latest 200 submissions (Can be from any platforms but latest 200 overall)
    }
    next();
})


export const User = mongoose.model("User", userSchema);