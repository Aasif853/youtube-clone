import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({ log: ["error"] }).$extends({});

// prisma.$use(async (params, next) => {
//   // Manipulate params here
//   const result = await next(params);
//   // See results here
//   return result;
// });

export default prisma;
