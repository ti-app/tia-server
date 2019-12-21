import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { FileRequest, AuthRequest } from '@appTypes/requests';
import PanicService from '@services/panic.service';
import { async } from 'rxjs/internal/scheduler/async';
import UploadService from '../services/upload.service';

export const getPanic = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    const { lat, lng, radius } = req.query;
    const allPanicRegistrations = await PanicService.fetchPanic(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      user
    );
    res.status(httpStatus.OK).json(allPanicRegistrations);
  } catch (e) {
    next(e);
  }
};

export const registerPanic = async (req: FileRequest, res: Response, next: NextFunction) => {
  const {
    panicType,
    googlePlaceName,
    numberOfPlants,
    googlePlaceId,
    lat,
    lng,
    description,
  } = req.body;

  let uploadedImage = {
    url: '',
    fileName: '',
  };

  if (req.file && req.file !== undefined) {
    uploadedImage = await UploadService.uploadImageToStorage(req.file);
  }
  const panicToRegister = {
    photo: uploadedImage.url,
    photoName: uploadedImage.fileName,
    location: {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
    panicType,
    googlePlaceName,
    numberOfPlants,
    googlePlaceId,
    description,
    createdAt: new Date().getTime(),
    createdBy: req.user.user_id,
    owner: {
      userId: req.user.user_id,
      displayName: req.user.name,
    },
    // moderatorApproved: SiteService.addedByModerator(req.user.role),
  };
  PanicService.create(panicToRegister);
  return res.status(httpStatus.OK).json({ message: 'panic registered', panicToRegister });
};
