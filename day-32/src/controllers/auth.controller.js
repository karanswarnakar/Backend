import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { sendEmail } from "../services/mail.service.js";



async function register(req, res, next) {
  const { name, username, email, password } = req.body

  const isUserExist = await UserModel.findOne({
    $or: [
      { username },
      { email }
    ]
  })

  if (isUserExist) {
    return res.status(400).json({
      message: "User already exist",
      success: false,
      msg: "User already exist"
    })
  }

  const hash = await bcrypt.hash(password, 10)

  const user = await UserModel.create({
    name,
    username,
    email,
    password: hash
  })
  const verificationLink = "#"
  await sendEmail({
    to: user.email,
    subject: "Welcome to DevX AI!",
    html: `<div style="
      margin: 0;
      padding: 35px 20px;
      background-color: #536fe3;
      font-family: Arial, Helvetica, sans-serif;
      text-align: center;
    ">

      <!-- Main Card -->
      <div style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 45px 35px;
        border-radius: 6px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.18);
      ">

        <!-- Logo / Icon -->
        <div style="
          margin-bottom: 20px;
          font-size: 42px;
        ">
         <img 
         style="  max-width: 200px;"
         src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYpptt99iqVCzj2J3cb4WamvSqLiqKQ4xBw5gepoM5OA&s=10" alt="logo">
        </div>

        <!-- Heading -->
        <h1 style="
          margin: 0 0 18px;
          color: #111827;
          font-size: 26px;
          font-weight: 700;
        ">
          Verify your email address
        </h1>

        <!-- Greeting -->
        <p style="
          margin: 0 0 12px;
          color: #333333;
          font-size: 14px;
          line-height: 1.6;
        ">
          Hi <strong>${user.username}</strong>,
        </p>

        <!-- Description -->
        <p style="
          margin: 0 auto 25px;
          max-width: 440px;
          color: #555555;
          font-size: 13px;
          line-height: 1.7;
        ">
          Thank you for registering at <strong>DevX AI</strong>.
          Please verify your email address to activate your account.
        </p>

        <!-- Verify Button -->
        <a
          href="${verificationLink}"
          style="
            display: inline-block;
            background-color: #4f7df3;
            color: #ffffff;
            padding: 13px 30px;
            border-radius: 3px;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
          "
        >
          Verify your email
        </a>

        <!-- Small text -->
        <p style="
          margin: 25px 0 8px;
          color: #777777;
          font-size: 11px;
        ">
          Or copy and paste this link into your browser
        </p>

        <!-- Verification URL -->
        <p style="
          margin: 0;
          word-break: break-all;
          color: #4f7df3;
          font-size: 9px;
        ">
          ${verificationLink}
        </p>

        <!-- Footer -->
        <div style="
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eeeeee;
        ">
          <p style="
            margin: 0;
            color: #999999;
            font-size: 10px;
          ">
            If you didn't create a DevX AI account,
            you can safely ignore this email.
          </p>

          <p style="
            margin: 12px 0 0;
            color: #aaaaaa;
            font-size: 10px;
          ">
            © 2026 DevX AI. All rights reserved.
          </p>
        </div>

      </div>

    </div>`
  })



  res.status(201).json({
    message: "User created successfully",
    success: true,
    user: {
      name: user.name,
      username: user.username,
      email: user.email,
      isVerified: user.isVerified,
    },
    msg: "Plz verify your email to continue"

  })
}



const authController = {
  register
}

export default authController