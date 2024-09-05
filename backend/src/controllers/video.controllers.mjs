import prisma from '../db/client.mjs';
import ApiRenponse from '../utils/ApiResponce.js';

export const getVidoes = async (req, res) => {
  // console.log(req.query);

  const filter = req.query?.filter ? JSON.parse(req.query.filter) : undefined;
  const limit = req.query?.limit ? parseInt(req.query.limit) : undefined;
  const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
  console.log('🚀 ~ getVidoes ~ offset:', offset, limit);
  const searchString = req.query.searchString ? req.query.searchString : '';
  const sortField = req.query.sortField ? req.query.sortField : 'id';
  const sortOrder = req.query.sortOrder ? req.query.sortOrder : 'asc';

  const payload = {
    where: filter?.where,
    skip: offset,
    take: limit,
    include: {
      channel: { select: { title: true, avatar: true } },
    },
  }
  const data = await prisma.$transaction([
    prisma.video.count({where: filter?.where}),
    prisma.video.findMany(payload)
   ])
  

  return res
    .status(200)
    .json(new ApiRenponse(200, {rows: data[1] , count: data[0] ?? 0}, 'Video fetched successfully'));
};
export const getSingleVideo = async (req, res, next) => {
  const id = req.params.id || null;
  console.log('🚀 ~ getSingleVideo ~ id:', id);
  if (!id) {
    return next({ message: `Please provide valid id` });
  }

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      channel: {
        select: {avatar: true, title: true, }, 
        // include :{ 
        //   _count: {
        //     select: {
        //       subscriptions: true,
        //     }
        //   }
        // }
      }
    },
  });
  if (!video) {
    res.status(404);
    return next({ message: `Could not find data with id ${id}` });
  }

  await prisma.video.update({where :{ id}, data: { views : { increment: 1}}})
  res.send({ data: video });
};

export const postVideos = async (req, res) => {
  const valResult = validationResult(req);

  if (!valResult.isEmpty()) {
    return res.send({ errors: valResult.array() });
  }

  const { body } = req;
  const params = {
    title: body.title,
    description: body.description,
    url: body.url,
    thumbnail: body.thumbnail,
    userId: body.userId,
  };
  try {
    const videoData = await addVideoDetailsToDB(params);
    res.status(200).send(videoData);
  } catch (err) {
    console.log('🚀 ~ createuser ~ err:', err);
    res.status(400);
    return res.status(400).send(err);
  }
};

export const deleteVideos = async (req, res) => {
  const {
    params: { id },
  } = req;
  const videos = await prisma.video.delete({ where: { id: id } });

  res.status(200).send();
};

export async function addVideoDetailsToDB(data) {
  return await prisma.video.create({
    data,
  });
}
