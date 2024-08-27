import prisma from "../db/client.mjs";
import ApiError from "../utils/ApiError.js";
import ApiRensonse from "../utils/ApiResponce.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getChannelDetails = asyncHandler(async (req, res, next) => {
  const id = req.params.id || null;
  if (!id) {
    throw new ApiError(400, `Please provide valid id`);
  }
  console.log("channelID", id);
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

  console.log("channelDetail", channel);
  if (!channel) {
    throw new ApiError(404, `Could not find data with id ${id}`);
  }
  return res
    .status(200)
    .json(new ApiRensonse(200, channel, "Record fetched successfully"));
});

export const subscribeToChannel = asyncHandler(async (req, res, next) => {
  const channelId = req.params?.id || null;

  if (!channelId) throw new ApiError(400, "Please provide valid channel id");

  const isSubscribed = await prisma.subscription.findFirst({
    where: { AND: [{ userId: req.user?.id }, { channelId }] },
  });
  if (isSubscribed) {
    return res
      .status(400)
      .json(new ApiRensonse(400, "Already subcribed to this channel"));
  }
  await prisma.subscription.create({
    data: { userId: req.user?.id, channelId },
  });

  return res.status(201).json(new ApiRensonse(201, "Subscribed successfully"));
});
