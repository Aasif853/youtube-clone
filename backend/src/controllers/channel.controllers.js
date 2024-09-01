import prisma from '../db/client.mjs';
import ApiError from '../utils/ApiError.js';
import ApiRensonse from '../utils/ApiResponce.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

export const getChannelDetails = asyncHandler(async (req, res, next) => {
  const id = req.params.id || null;
  if (!id) {
    throw new ApiError(400, `Please provide valid id`);
  }
  console.log('channelID', id);
  const channel = await prisma.channel.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          subscriptions: true,
          // videos: true,
        },
      },
    },
  });

  console.log('channelDetail', channel);
  if (!channel) {
    throw new ApiError(404, `Could not find data with id ${id}`);
  }
  return res
    .status(200)
    .json(new ApiRensonse(200, channel, 'Record fetched successfully'));
});

export const subscribeToChannel = asyncHandler(async (req, res, next) => {
  const channelId = req.params?.id || null;

  if (!channelId) throw new ApiError(400, 'Please provide valid channel id');

  const isSubscribed = await prisma.subscription.findFirst({
    where: { AND: [{ userId: req.user?.id }, { channelId }] },
  });
  if (isSubscribed) {
    return res
      .status(400)
      .json(new ApiRensonse(400, 'Already subcribed to this channel'));
  }
  await prisma.subscription.create({
    data: { userId: req.user?.id, channelId },
  });

  return res.status(201).json(new ApiRensonse(201, 'Subscribed successfully'));
});

export const updateChannel = asyncHandler(async (req, res) => {
  const channelId = req.params?.id || null;
  const { title, email, description } = req.body;

  if (!channelId) throw new ApiError(400, 'Please provide valid channel id');

  const channel = await prisma.channel.findUnique({ where: { id: channelId } });

  if (!channel) throw new ApiError(404, 'Could nnt find channel');

  const params = { title, email, description };
  const udpatedChannel = await prisma.channel.update({
    data: params,
    where: { id: channelId },
  });
  return res
    .status(200)
    .json(new ApiRensonse(200, udpatedChannel, 'Channel updated successfully'));
});

export const updateImages = asyncHandler(async (req, res) => {
  const channelId = req.params?.id || null;

  console.log('requestfiless', req.files);
  const avatarLocalPath = req.files?.avatar
    ? req.files?.avatar[0]?.path
    : false;
  const coverImageLocalPath = req.files?.coverImage
    ? req.files?.coverImage[0]?.path
    : false;

  if (!channelId) throw new ApiError(400, 'Please provide valid channel id');

  if (!(avatarLocalPath || coverImageLocalPath))
    throw new ApiError(400, 'Please provide valid image');

  const channel = await prisma.channel.findUnique({ where: { id: channelId } });

  if (!channel) throw new ApiError(404, 'Could nnt find channel');

  const avatar = await uploadToCloudinary(avatarLocalPath);
  const coverImage = await uploadToCloudinary(coverImageLocalPath);
  console.log('🚀 ~ updateImages ~ coverImage:', coverImage);

  const params = {
    avatar: avatar?.url || channel.avatar,
    coverImage: coverImage?.url || channel.coverImage,
  };

  const udpatedChannel = await prisma.channel.update({
    data: params,
    where: { id: channelId },
  });

  return res
    .status(200)
    .json(new ApiRensonse(200, udpatedChannel, 'Image updated successfully'));
});
