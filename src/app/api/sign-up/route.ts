import { sendVerivicationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, email, password } = await request.json();
    const existingUserverifiedByuserName = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserverifiedByuserName) {
      return Response.json(
        {
          success: false,
          message: "the username is already taken",
        },
        { status: 400 }
      );
    }
    const existingUserByMail = await UserModel.findOne({ email });
    let verifyCode = Math.floor(100000 + Math.random() * 90000).toString();

    if (existingUserByMail) {
      if (existingUserByMail.isVerified) {
        Response.json(
          {
            success: false,
            message: "user Email alrady exists",
          },
          { status: 400 }
        );
      }
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      const exparyDate = new Date();
      exparyDate.setHours(exparyDate.getHours() + 1);

      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: exparyDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await newUser.save();
    }
    // send Verification email

    const emailResponse = await sendVerivicationEmail(
      username,
      email,
      verifyCode
    );
  } catch (error) {
    console.error("Error registering user ", error);
    return Response.json(
      {
        success: false,
        message: "error registering user ",
      },
      {
        status: 500,
      }
    );
  }
}
