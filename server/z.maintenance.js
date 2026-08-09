import { Problem } from './models/Problem.js'
import { Profile } from './models/Profile.js';
import { User } from './models/User.js';

import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const clean_spammers = async () => {
    const profiles = await Profile.find();

    const spammers = [];

    for (const pro of profiles) {
    const user = await User.findOne({ profile: pro._id });
    if (!user) {
        spammers.push(pro);
        await Profile.deleteOne(pro);
        
    }
    }

    console.log(spammers);
    console.log(spammers.length);
    console.log("Scan finished")
}

const fun = async () => {
    console.log("Maintenance started");
    const profile = await Profile.findOne({bio : "Consistent Programmer"});

    let sum = 0;
    for(let i = 0; i < profile.codeforces.categories.length; i++){
        sum += profile.codeforces.categories[i].count;
    }
    const tot = profile.codeforces.solved;
    console.log(sum);
    console.log(tot);
    let temp = tot;

    console.log(profile);
    for(let i = 0; i < profile.codeforces.categories.length; i++){
        profile.codeforces.categories[i].count = Math.floor(profile.codeforces.categories[i].count * tot / sum);
        temp -= profile.codeforces.categories[i].count;
    }
    profile.codeforces.categories[0].count += temp;

    await profile.save();
    //await clean_spammers();
    console.log("Done boy!")
}

fun();

// const clean_solvers = async () => {
//     const problems = await Problem.find({});
//     let tot = 0;
//     let unsolved = 0;
//     for (const prb of problems) {
//         tot++;
//         if (prb.solvers.length == 1) unsolved++;

//         prb.solvers = [];
//         await prb.save();
//     }
//     console.log("Problems found : ", tot);

//     console.log("Unsolved nos : ", unsolved);

//     console.log("All solvers cleaned.");
// }


// const clean_user = async (user_id) => {
//     const ac = await User.findById(user_id);

//     if (ac) await Profile.findByIdAndDelete(ac.profile);
//     await User.findByIdAndDelete(user_id);

//     const allUsers = await User.find({});

//     allUsers.forEach(async (user) => {
//         user.friends = user.friends.filter(fr => fr.toString() !== user_id);
//         await user.save();
//     });

//     // const allProblems = await Problem.find({});
//     // allProblems.forEach(async (prb) => {
//     //     prb.solvers = prb.solvers.filter(s => s.toString() !== user_id);
//     //     await prb.save();
//     // });

//     console.log("User's entire data cleaned.");
// }


// const fun = async () => {
//     const allProfiles = await Profile.find({});

//     allProfiles.forEach(async (profile) => {
//         profile.codeforces.contests = [];
//         profile.codechef.contests = [];
//         profile.leetcode.contests = [];

//         await profile.save();
//     });

//     console.log("All rating data cleared");
// }

// const abc = async () => {
//     const allProfiles = await Profile.find({});
//     let c = 0;
//     allProfiles.forEach(async (p) => {
//         if(p.codeforces.handle || p.codechef.handle || p.leetcode.handle) c++;
//     })
//     console.log(c);
// }

// abc();

// clean_solvers();
// clean_user('68494926424d0a55b4b24d2d');
// fun();

