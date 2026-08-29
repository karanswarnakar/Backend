import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import { sendEmail } from "../services/mail.service.js";



async function register(req, res) {
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

  const token = jwt.sign({
    email: user.email
  }, process.env.JWT_SECRET)



  const url = process.env.FRONTEND_URL;
  const port = process.env.PORT;
  const verificationLink = `${url}:${port}/api/auth/verify-email?token=${token}`


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



  return res.status(201).json({
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

async function login(req, res) {
  const { username, email, password } = req.body

  const user = await UserModel.findOne({
    $or: [
      { username },
      { email }
    ]
  }).select("+password")


  if (!user) {
    let msg = ""
    if (username) {
      msg = "User not exist with this username"
    } else if (email) {
      msg = "User not exist with this email"
    }
    return res.status(404).json({
      message: "User not find",
      success: false,
      msg
    })
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password)
  if (!isPasswordMatched) {
    return res.status(409).json({
      message: "Invalid credentials.",
      success: false,
      msg: "Invalid password."
    })
  }
  const isVerified = user.isVerified

  if (!isVerified) {
    return res.status(400).json({
      message: "Email is not verified.",
      success: false,
      msg: `You need to verify ${user.email}.`
    })
  }


  const token = jwt.sign({
    id: user._id,
    email: user.email
  }, process.env.JWT_SECRET, { expiresIn: "7d" })


  res.cookie("token", token)

  return res.status(200).json({
    message: "User login successfully.",
    success: true,
    msg: `User login successfully ${user.email}.`
  })

}

async function getMe(req, res) {
  const userId = req.user.id;

  try {
    const user = await UserModel.findById(userId)

    return res.status(200).json({
      message: "User fetch successfully.",
      success: true,
      user,
    })
  } catch (err) {
    return res.status(500).json({
      message: "User not found",
      success: false,
      msg: "User not login yet."
    })
  }
}

  async function verifyEmail(req, res) {
    const { token } = req.query
    if (!token) {
      return res.status(401).json({
        message: " Invalid token",
        success: false,
        msg: "Token is required"
      })
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET)

    const user = await UserModel.findOne({ email: decode.email })



    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
        msg: "User not found"
      })
    }

    user.isVerified = true
    await user.save()



    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Email Verified | DevX AI</title>

  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;

      background: linear-gradient(
        135deg,
        #536fe3 0%,
        #6d83ed 50%,
        #8b9df5 100%
      );

      font-family:
        Arial,
        Helvetica,
        sans-serif;

      padding: 20px;
    }

    .container {
      width: 100%;
      max-width: 460px;
    }

    .card {
      background: #ffffff;
      border-radius: 20px;
      padding: 45px 35px;
      text-align: center;

      box-shadow:
        0 25px 60px rgba(0, 0, 0, 0.18);

      animation: slideUp 0.5s ease;
    }

    /* Success Icon */
    .success-icon {
      width: 90px;
      height: 90px;

      margin: 0 auto 25px;

      border-radius: 50%;

      background: #ecfdf3;

      display: flex;
      align-items: center;
      justify-content: center;

      font-size: 45px;

      animation: pop 0.5s ease;
    }

    .title {
      color: #111827;
      font-size: 28px;
      font-weight: 700;

      margin-bottom: 12px;
    }

    .subtitle {
      color: #6b7280;
      font-size: 15px;
      line-height: 1.7;

      margin-bottom: 30px;
    }

    .button {
      display: inline-block;

      padding: 14px 32px;

      background: #4f7df3;
      color: #ffffff;

      text-decoration: none;

      border-radius: 8px;

      font-size: 14px;
      font-weight: 600;

      transition: 0.2s ease;

      box-shadow:
        0 6px 15px rgba(79, 125, 243, 0.3);
    }

    .button:hover {
      background: #3f6ee8;

      transform: translateY(-2px);

      box-shadow:
        0 8px 20px rgba(79, 125, 243, 0.4);
    }

    .footer {
      margin-top: 30px;

      color: #9ca3af;

      font-size: 12px;
    }

    .brand {
      font-weight: 700;
      color: #4f7df3;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(25px);
      }

      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes pop {
      0% {
        opacity: 0;
        transform: scale(0.5);
      }

      70% {
        transform: scale(1.1);
      }

      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    @media (max-width: 480px) {
      .card {
        padding: 40px 25px;
      }

      .title {
        font-size: 24px;
      }

      .subtitle {
        font-size: 14px;
      }
    }
  </style>
</head>

<body>

  <div class="container">

    <div class="card">

      <!-- Success Icon -->
      <div class="success-icon">
        ✓
      </div>

      <!-- Title -->
      <h1 class="title">
        Email Verified!
      </h1>

      <!-- Description -->
      <p class="subtitle">
        Your email address has been successfully verified.
        Your <strong>DevX AI</strong> account is now active and ready to use.
      </p>

      <!-- Login Button -->
      <a
        href="${process.env.FRONTEND_URL}/api/auth/login"
        class="button"
      >
        Continue to Login
      </a>

      <!-- Footer -->
      <div class="footer">
        Welcome to <span class="brand">DevX AI</span> 🚀
        <br />
        © 2026 DevX AI. All rights reserved.
      </div>

    </div>

  </div>

</body>
</html>


  `

    res.send(html)


  }

  const authController = {
    register,
    login,
    getMe,
    verifyEmail
  }

  export default authController