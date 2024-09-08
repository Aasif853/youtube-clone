import ApiError from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import prisma from '../db/client.mjs';

const verifyJWT = (isOptional = false) =>
  asyncHandler(async (req, _, next) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');
      console.log('🚀 ~ asyncHandler ~ token:', token, isOptional);
      if (!token) {
        if (!isOptional) {
          throw new ApiError(401, 'Unauthorized request');
        } else {
          // If auth is optional, just skip the verification
          return next();
        }
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await prisma.user.findUnique({
        // omit: { refreshToken: true },
        where: { id: decodedToken?.id },
      });
      console.log('request user', user.id);
      if (!user && !isOptional) {
        throw new ApiError(401, 'Invalid access token');
      }

      req.user = user;
      next();
    } catch (error) {
      if (isOptional) {
        // Skip to the next middleware if the token is invalid but the request is optional
        return next();
      } else {
        throw new ApiError(401, error?.message || 'Invalid access token');
      }
    }
  });

export default verifyJWT;
