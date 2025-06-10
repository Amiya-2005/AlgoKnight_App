import { decodeToken } from "../utils/token.js";

const tokenChecker = () => {
    return (req, res, next) => {
        const token = req.cookies.token;

        console.log("🔑 Verifying Token received from client...");

        if(!token){
            console.log("➖ No token found");
            return next();
        }
        try{
            const userPayload = decodeToken(token);
            req.user = userPayload;
            console.log("✅ Token verified")
            return next();
        }
        catch(error) {
            console.error("❌ Invalid token : ", error);
            return next();
        }
    }
}

export default tokenChecker;