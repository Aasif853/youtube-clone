import prisma from '../db/client.mjs';
import { validationResult } from 'express-validator';

export const getUsers = async (req, res) => {
  const allUser = await prisma.user.findMany();
  console.log('🚀 ~ router.get ~ allUser:', allUser);
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
    where: { email: body['email'] },
  });
  if (user) {
    res.status(400);
    return next({ message: 'Email already exist' });
  }
  await prisma.user
    .create({
      data: body,
    })
    .then((userData) => {
      console.log('🚀 ~ createuser ~ userData:', userData);
      res.status(200).send({ dat: user });
    })
    .catch((err) => {
      console.log('🚀 ~ createuser ~ err:', err);
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
