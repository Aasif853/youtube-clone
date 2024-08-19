import prisma from "../db/client.mjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

export const getUsers = async (req, res) => {
  const allUser = await prisma.user.findMany();
  console.log("🚀 ~ router.get ~ allUser:", allUser);
  res.send({ data: allUser });
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

export const signUpUser = async (req, res) => {
  const { body } = req;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  const user = await prisma.user.findUnique({
    where: { email },
  });
  try {
    const token = jwt.sign({ user: body }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    if (user) {
      await prisma.user
        .update({ where: { email: email }, data: { token, ...body } })
        .then((user) => {
          res.status(200).json({
            message: "User signed in succesfully",
            user,
          });
        });
    } else {
      await prisma.user
        .create({
          data: { token, ...body },
        })
        .then((user) =>
          res.status(200).json({
            message: "User signed up succesfully",
            user,
          }),
        );
    }
  } catch (err) {
    console.log("Error", err);
    // next(err);
    res.status(401).json({
      message: "User not successful created",
      error: err.mesage,
    });
  }
};
