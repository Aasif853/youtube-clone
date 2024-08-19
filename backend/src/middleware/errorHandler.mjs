import { errors } from '../utils/constants.mjs';

const errorHandler = (err, req, res, next) => {
  console.log('🚀 ~ errorHandler ~ err:', err);
  const statusCode = res.statusCode ? res.statusCode : 500;
  switch (statusCode) {
    case errors.VALIDATION_ERROR:
      res.json({
        title: 'Validation Failed',
        message: err.message,
        startTrace: err.stack,
      });
      break;
    case errors.NOT_FOUND:
      res.json({
        title: 'Not Found',
        message: err.message,
        startTrace: err.stack,
      });
    case errors.UNAUTHORIZED:
      res.json({
        title: 'Un authorized',
        message: err.message,
        startTrace: err.stack,
      });
    case errors.FORBIDDEN:
      res.json({
        title: 'Forbidden',
        message: err.message,
        startTrace: err.stack,
      });
      break;
    case errors.SERVER_ERROR:
      res.json({
        title: 'Server Error',
        message: err.message,
        startTrace: err.stack,
      });
      break;
    default:
      console.log('No Error, all good');
      res.json({});
      break;
  }
};

export default errorHandler;
