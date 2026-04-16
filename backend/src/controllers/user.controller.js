import {
  getMyProfileService,
  updateMyProfileService,
  uploadAvatarService,
} from "../services/user.service.js";

export const getMyProfileController = async (req, res, next) => {
  try {
    const user = await getMyProfileService(req.user.userId);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const updateMyProfileController = async (req, res, next) => {
  try {
    const user = await updateMyProfileService({
      userId: req.user.userId,
      name: req.body.name,
      email: req.body.email,
    });

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadAvatarController = async (req, res, next) => {
  try {
    const user = await uploadAvatarService({
      userId: req.user.userId,
      file: req.file,
    });

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};