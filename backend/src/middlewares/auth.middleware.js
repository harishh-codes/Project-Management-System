import { User } from "../models/user.model.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import jwt from "jsonwebtoken"

export const verifyJWT = asyncHandler( async(req, res, next) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }
    
    try {
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        
        const userId = decodedToken._id || decodedToken.id;

        if (!userId) {
        throw new ApiError(401, "Invalid token payload");
        }

        const user = await User.findById(userId).select("-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry")
        
        if(!user){
            throw new ApiError(401, "Invalid access token")
        }
        
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, "Invalid access token")
    }
})