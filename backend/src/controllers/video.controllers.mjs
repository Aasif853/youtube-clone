import prisma from '../db/client.mjs';
import { validationResult } from 'express-validator';

export const getVidoes = async (req, res) => {
  const videos = await prisma.video.findMany({
    include: {
      user: true,
    },
  });
  res.send({ data: videos });
};
export const getSingleVideo = async (req, res, next) => {
  const id = req.params.id ? parseInt(req.params.id) : null;
  console.log('🚀 ~ getSingleVideo ~ id:', id);
  if (!id) {
    return next({ message: `Please provide valid id` });
  }

  const video = await prisma.video.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });
  if (!video) {
    res.status(404);
    return next({ message: `Could not find data with id ${id}` });
  }
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

const cards = [
  {
    thumbnail:
      'https://i.ytimg.com/vi/6TYkDy54q4E/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBWCIWtkNOQuG_8cs42HbQygXoCTA',
    duration: '11:11',
    profile:
      'https://yt3.googleusercontent.com/UlKrbeZ4Xz79DUbEbF3FvC0FQ4A_cvpIIzhJQ_wigP8CL_Xf_WF-ryYrrtGpqpD9WzAplsUz=s176-c-k-c0x00ffffff-no-rj',
    title: 'ImNotGoodEnough.js',
    views: '637k',
    time: '1 year',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/rioc6mTWOZs/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDJiTR6fmKJU7LmK2o1lfq5F7PXEw',
    duration: '24:26',
    profile:
      'https://yt3.googleusercontent.com/tWGVfHXn5SaAsw-7livA-p-Db6VrWKtLESCqIaR0Gw6cMN47dhUWt3nMPYcoF7ueZBDsUq4atg=s176-c-k-c0x00ffffff-no-rj',
    title: 'Photoshopping YOUR Drawings! | Realistified! S1E3',
    views: '11M',
    time: '2 years',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/-QgJgZCJvo4/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLB_2KVRoB69h4VCTsgcCODnftemTA',
    duration: '37:45',
    profile:
      'https://yt3.googleusercontent.com/ytc/AOPolaS101j27Disa_BYArytv-hXMRl8wNMtqZMTkrfH=s176-c-k-c0x00ffffff-no-rj',
    title: 'I Challenged The CSS King To A CSS Battle',
    views: '1.2M',
    time: '2 years',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/pY-kr8DgnWk/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDfnmE-lFvJm6jPhcTdJz6-fIe95A',
    duration: '15:01',
    profile:
      'https://yt3.googleusercontent.com/okRlBwXJN68DuPhHs_AaMlOHVwfnHWEL7is5lV3RTyYlJSDvOy58-q-OyCm5bSOU71csOHyaKQ=s176-c-k-c0x00ffffff-no-rj',
    title: 'VFX Artists React to Bad & Great CGi 9',
    views: '6.7M',
    time: '3 years',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/YjYsjyu7TIY/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBNLuOheAZSFFZQUDo_vSFpvga2vg',
    duration: '4:39',
    profile:
      'https://yt3.googleusercontent.com/ytc/AOPolaRbWvcPuAZMiqeKn637mEoXt2qZg-z1Aic6mFg=s176-c-k-c0x00ffffff-no-rj',
    title:
      'Wednesday Playing Cello Theme | Paint It Black - The Rolling Stones (Episode 1 Soundtrack Netflix)',
    views: '5.8M',
    time: '8 months',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/0e3GPea1Tyg/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLD97HrPD21P7TSwUSpdGr2vz7i7cg',
    duration: '25:42',
    profile:
      'https://yt3.googleusercontent.com/ytc/AOPolaSe-ifBRtdfb67uDM8kaHdhdPdQny-MaSRdBfT2NA=s176-c-k-c0x00ffffff-no-rj',
    title: '$456,000 Squid Game In Real Life!',
    views: '469M',
    time: '1 year',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/nk0qACYkbQM/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCxAA5VdczKRj0edUtijLRdzLJP4A',
    duration: '15:34',
    profile:
      'https://yt3.googleusercontent.com/enyLBm1Sy8mVRXJJLWHT2z64nqxJGt2g61A9xnxpUjO2YAUovHaY_JT3rnAg0j6Qij9iaHQlAg=s176-c-k-c0x00ffffff-no-rj',
    title: 'Nothing Phone (2) Impressions ft Nothing CEO!',
    views: '2.7M',
    time: '2 weeks',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/0fA8J1UyT6I/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLBaykf02_5xrw5BkGU7KLh4Q1tdYw',
    duration: '16:33',
    profile:
      'https://yt3.googleusercontent.com/ytc/AOPolaQnQusYXzxBd2-knQxbeFiCWZ_dfPdX0Mu5v_oQcg=s176-c-k-c0x00ffffff-no-rj',
    title:
      'Incredible Hidden Details in Spider-Man: Across The Spider-Verse (Part 3)',
    views: '850k',
    time: '8 days',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/CGjKO_F6y9g/hqdefault.jpg?sqp=-oaymwEcCNACELwBSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAIpcMuo9sN9S1rt0lU6on23YoPpw',
    duration: '11:45',
    profile:
      'https://yt3.googleusercontent.com/HB-lIXnCINyWJY17l3UppuluNz_pc4uxv9KhtZuGJSjEjcByODmpqb1I9B2Tv5UUCywdolWaveg=s176-c-k-c0x00ffffff-no-rj',
    title: 'Can I Build a SHIPWRECK in ROBLOX?! | Theme Park Tycoon 2 • #38',
    views: '38k',
    time: '2 days',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/ejoEUpUSIiU/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLCTe-27OKAFkYPRssdqMkVWZKbNmA',
    duration: '3:42',
    profile:
      'https://yt3.ggpht.com/9QBOD8JbiG7_HHZj7TUOtTriUcAefAWxtBRaun832mE4y_OCzIcLq8Lf_3yWshHiwPePhPznTQ=s88-c-k-c0x00ffffff-no-rj',
    title: 'Loki Theme | EPIC GLORIOUS VERSION (Loki Soundtrack Cover)',
    views: '5.9M',
    time: '2 years',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/705XCEruZFs/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLA2oEKcrIi5CpR9mpcL-JFu_wkwYA',
    duration: '11:37',
    profile:
      'https://yt3.ggpht.com/ytc/AOPolaQ2iMmw9cWFFjnwa13nBwtZQbl-AqGYkkiTqNaTLg=s68-c-k-c0x00ffffff-no-rj',
    title:
      'The Joy of CSS Grid - Build 3 Beautifully Simple Responsive Layouts',
    views: '405k',
    time: '3 years',
    userId: 1,
  },
  {
    thumbnail:
      'https://i.ytimg.com/vi/vgjSrJ022lo/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLAAV7r0Pyh0-zxpBR-QxM2aQYHHwQ',
    duration: '11:54',
    profile:
      'https://yt3.googleusercontent.com/ytc/AOPolaRHeytO1y7AbKLw3UyJFoIAMydxKNnuz2Y-gVi4iw=s176-c-k-c0x00ffffff-no-rj',
    title: "MINOTAUR'S MOST SAVAGE FIGHTS! | BattleBots",
    views: '9.8M ',
    time: '1 year',
    userId: 1,
  },
];
