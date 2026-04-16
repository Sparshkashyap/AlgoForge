import prisma from "../config/db.js";
import cloudinary from "../config/cloudinary.js";

const uploadBufferToCloudinary = (buffer, folder = "algoforge/avatars") =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(buffer);
  });

export const getMyProfileService = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
};

export const updateMyProfileService = async ({
  userId,
  name,
  email,
}) => {
  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
};

export const uploadAvatarService = async ({ userId, file }) => {
  if (!file) {
    const error = new Error("Image file is required");
    error.statusCode = 400;
    throw error;
  }

  const uploaded = await uploadBufferToCloudinary(file.buffer);

  return prisma.user.update({
    where: { id: userId },
    data: {
      avatarUrl: uploaded.secure_url,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      plan: true,
      avatarUrl: true,
      solvedCount: true,
      streak: true,
      createdAt: true,
      lastSeenAt: true,
    },
  });
};