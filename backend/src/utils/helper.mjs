import prisma from '../db/client.mjs';

export const resolveUserById = async (req, res, next) => {
  const {
    params: { id },
  } = req;
  console.log('🚀 ~ resolveUserById ~ id:', id);

  //   try {
  //     const user = await prisma.user.findUnique({ where: { id } });
  //     console.log('🚀 ~ resolveUserById ~ user:', user);
  //     if (!user) return res.sendStatus(404);
  //     req.user = user;
  //     next();
  //   } catch (err) {
  //     return res.sendStatus(404);
  //   }
  await prisma.user
    .findUniqueOrThrow({ where: { id } })
    .then((user) => {
      console.log('🚀 ~ .then ~ user:', user);
      req.user = user;
      next();
    })
    .catch((err) => {
      return res.sendStatus(404);
    });
};
