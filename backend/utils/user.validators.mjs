export const userValidator = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32,
      },
      errorMessage:
        'Username must be at least 5 characters and a max of 32 characters',
    },
    notEmpty: {
      errorMessage: 'Username is required',
    },
    isString: true,
  },
  email: {
    notEmpty: {
      errorMessage: 'Email is required',
    },
  },
};

export const videoValidator = {
  title: { isString: true, errorMessage: 'Title is required' },
};
