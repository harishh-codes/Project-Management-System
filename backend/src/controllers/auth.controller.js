import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"
import { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail } from "../utils/mail.js"
import Mailgen from "mailgen"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const generateAccessTokenAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating access token")
    }
}

const registerUser = asyncHandler( async(req,res) => {
    const {username, password, email, role} = req.body 

    const existingUser = await User.findOne({
        $or: [{email},{username}]
    })

    if(existingUser){
        throw new ApiError(409, "User with email or username already exists", [])
    }

    const user = await User.create({
        email,
        username,
        password,
        isEmailVerified: false
    })

    const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken
    user.emailVerificationTokenExpiry = tokenExpiry

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(user.username, `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`)
    })

    const createdUser = await User.findById(user._id).select(
        "-password -emailVerificationToken -emailVerificationTokenExpiry -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering a user")
    }

    return res
        .status(201)
        .json(
            new ApiResponse(
                200,
                {user: createdUser},
                "User registered successfully and verification email has been sent on your email"
            )
        )
})

const login = asyncHandler( async(req, res) => {
    const {email, password} = req.body

    if(!email){
        throw new ApiError(400, "Email is required")
    }

    const user = await User.findOne({ email })

    if(!user){
        throw new ApiError(400, "User does not exists")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid credentials")
    }

    const {accessToken, refreshToken} = await generateAccessTokenAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
        "-password -refreshToken -emailVerificationToken -emailVerificationTokenExpiry"
    )

    const options = {
        httpOnly: true,
        secure: false, // disable during local dev
        sameSite: "lax"
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser,
                    accessToken,
                    refreshToken
                },
                "User logged in successfully"
            )
        )
})

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {refreshToken : ""}
        },
        {
            new: true
        },
    )
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("refreshToken")
        .clearCookie("accessToken")
        .json(
            new ApiResponse(200, {}, "User Logged Out ")
        )
})

const getCurrentUser = asyncHandler(async (req, res) => {
    res
    .status(200)
    .json(
        new ApiResponse(
            200,
            req.user,
            "Current user fetched successfully"
        )
    )
})

const verifyEmail = asyncHandler(async(req, res) => {
    const {verificationToken} = req.params

    if(!verificationToken){
        throw new ApiError(400, "Email verification token is missing")
    }

    const hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex")

    const user = await User.findOne({
        emailVerificationToken: hashedToken,
        emailVerificationTokenExpiry: {$gt: Date.now()}
    })

    if(!user){
        throw new ApiError(400, "Token is invalid or expired")
    }

    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpiry = undefined;

    user.isEmailVerified = true
    await user.save({validateBeforeSave: false})

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    isEmailVerified: true
                },
                "Email is verified"
            )
        )

})

const resendEmailVerification = asyncHandler(async(req,res) => {
    const user = await User.findOne(req.user?._id)

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    if(user.isEmailVerified){
        throw new ApiError(409, "Email already verified")
    }

    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

    user.emailVerificationToken = hashedToken;
    user.emailVerificationTokenExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject: "Please verify your email",
        mailgenContent: emailVerificationMailgenContent(
            user.username,
            `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
        ),
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Mail has been sent to your email ID"
            )
        )

})

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token missing");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (error) {
    throw new ApiError(403, "Invalid or expired refresh token");
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    throw new ApiError(403, "Invalid refresh token");
  }

  if (incomingRefreshToken !== user.refreshToken) {
    throw new ApiError(403, "Refresh token does not match stored token");
  }

  const { accessToken, refreshToken: newRefreshToken } =
    await generateAccessTokenAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    );
});

const forgotPasswordRequest = asyncHandler(async(req,res)=> {
    const {email} = req.body

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    const {unHashedToken, hashedToken, tokenExpiry} = user.generateTemporaryToken()

    user.forgotPasswordToken = hashedToken;
    user.forgotPasswordTokenExpiry = tokenExpiry;

    await user.save({validateBeforeSave: false})

    await sendEmail({
        email: user?.email,
        subject: "Password reset request",
        mailgenContent: forgotPasswordMailgenContent(
            user.username,
            `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`
        )
    })

    return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {},
            "Password reset mail has been sent to your mail id"
        )
      )

})

const resetForgotPassword = asyncHandler(async(req,res) => {
    const {resetToken} = req.params
    const {newPassword} = req.body
    const {confirmNewPassword} = req.body

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex")

       const user = await User.findOne({
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: {$gt: Date.now()}
       })
       
       if(!user){
        throw new ApiError(409, "Token is invalid or expired")
       }

       if(!newPassword || !confirmNewPassword){
        throw new ApiError(400, "Password fields are required")
       }

       if(newPassword !== confirmNewPassword){
        throw new ApiError(400, "Password did not match")
       }

       user.forgotPasswordToken = undefined;
       user.forgotPasswordTokenExpiry = undefined;

       user.password = newPassword
       
       await user.save({validateBeforeSave: false})

       return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Password reset successfully"
            )
        )

})

const changePassword = asyncHandler(async(req,res)=> {
    const {oldPassword , newPassword} = req.body

    const user = await User.findById(req.user?._id)

    const isPasswordValid = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordValid){
        throw new ApiError(400, "Invalid old password")
    }

    user.password = newPassword

    await user.save({validateBeforeSave: false})

    return res
      .status(200)
      .json(
        new ApiResponse(
            200,
            {},
            "Password changed successfully"
        )
      )

})

export { registerUser, login, logoutUser , getCurrentUser, verifyEmail, resendEmailVerification, refreshAccessToken, forgotPasswordRequest, resetForgotPassword, changePassword}