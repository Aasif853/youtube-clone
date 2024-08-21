import prisma from "../db/client.mjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponce from "../utils/ApiResponce.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const generateAndUpdateAccessAndRefreshToken = async (userData) => {
  try {
    const refreshToken = jwt.sign(
        { userId: userData.id },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        },
      ),
      accessToken = jwt.sign(
        {
          id: userData.id,
          email: userData.email,
          username: userData.username,
          avatar: userData.avatar,
          name: userData.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        },
      );

    await prisma.user.update({
      where: { id: userData.id },
      data: { refreshToken, accessToken },
    });
    return { refreshToken, accessToken };
  } catch (err) {
    throw new ApiError(500, "Something went wrong while generating token");
  }
};
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
});
export const signIpWithGoogle = asyncHandler(async (req, res) => {
  const { name, email, username, avatar, googleId, googleToken } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const body = {
    email,
    username,
    name,
    avatar,
    googleToken,
    googleId,
  };

  let updatedUser;
  if (existingUser) {
    updatedUser = await prisma.user.update({
      where: { email: email },
      data: { googleToken, googleId },
    });
  } else {
    // const avatarCloudinary = await uploadToCloudinary(body.avatar);
    updatedUser = await prisma.user.create({
      data: body,
    });
  }

  if (updatedUser) {
    const { refreshToken, accessToken } =
      await generateAndUpdateAccessAndRefreshToken(existingUser);

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponce(
          200,
          { ...updatedUser, refreshToken, accessToken },
          "User signed in successfully",
        ),
      );
  } else {
    throw new ApiError(500, "Something went wrong");
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user.id;
  const user = await prisma.user.update({
    where: { id },
    data: { accessToken: null, refreshToken: null },
  });
  console.log("requser", user);

  const options = { httpOnly: true, secure: true };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponce(200, {}, "User successfully logged out"));
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, avatar, googleId, googleToken } = req.body;
  const avatarLocalPath = req.file.path;
  console.log("req.files", req.file);
  if (!email) {
    throw new ApiError(400, "Email is required");
  }
  if (!avatar && !avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new ApiError(409, "Email already exist");
  }

  const avatarCloudinary = await uploadToCloudinary(avatarLocalPath || avatar);
  await prisma.user
    .create({
      data: {
        email,
        username,
        name,
        avatar: avatarLocalPath ? avatarCloudinary.url : avatar || "",
        googleId,
        googleToken,
      },
    })
    .then((userData) => {
      console.log("🚀 ~ createuser ~ userData:", userData);
      return res
        .status(201)
        .json(new ApiResponce(201, userData, "User register successfully"));
    })
    .catch((err) => {
      console.log("🚀 ~ createuser ~ err:", err);
      throw new ApiError(500, "Something went wrong");
    });
});

export const refreshAccesToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookie?.refreshToken || req.body?.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await prisma.user.findUnique({
      where: { id: decodeToken.id },
    });

    if (!user) throw new ApiError(401, "Invalid refresh token");

    if (incomingRefreshToken !== user?.refreshToken) {
      if (!user) throw new ApiError(401, "Refresh token is expired or used");
    }

    const { refreshToken, accessToken } =
      await generateAndUpdateAccessAndRefreshToken(user);

    const options = {
      httpOnly: true,
      secure: true,
    };
    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponce(
          200,
          { refreshToken, accessToken },
          "Access token refreshed",
        ),
      );
  } catch (err) {
    throw new ApiError(401, err?.message || "Invalid refresh token");
  }
});
export const getUsers = async (req, res) => {
  const allUser = await prisma.user.findMany();
  res.status(200).json({ data: allUser });
};

export const createuser = async (req, res, next) => {
  const valResult = validationResult(req);
  if (!valResult.isEmpty()) {
    return res.status(400).send({ errors: valResult.array() });
  }
  const { body } = req;
  // try {

  const user = await prisma.user.findUnique({
    where: { email: body["email"] },
  });
  if (user) {
    res.status(400);
    return next({ message: "Email already exist" });
  }
  await prisma.user
    .create({
      data: body,
    })
    .then((userData) => {
      console.log("🚀 ~ createuser ~ userData:", userData);
      res.status(200).send({ data: user });
    })
    .catch((err) => {
      console.log("🚀 ~ createuser ~ err:", err);
      return res.status(400).send(err);
    });
  // } catch (err) {
  //   console.log('🚀 ~ createuser ~ err:', err);
  //   return res.status(400).send(err);
  // }
  // const allUser = await prisma.user.findMany();
};

export const getUser = async (req, res) => {
  const { user } = req;
  res.status(200).send({ data: user });
};

export const updateUser = async (req, res) => {
  const { body, user } = req;

  prisma.user
    .update({ where: { id: user.id }, data: body })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.sendStatus(400);
    });
};

export const deleteUser = async (req, res) => {
  prisma.user
    .delete({ where: { id: req.user.id } })
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((err) => res.sendStatus(400));
};
