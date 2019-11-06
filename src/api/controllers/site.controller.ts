import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import SiteService from '../services/site.service';
import UploadService from '../services/upload.service';
import constants from '@constants';
import { AuthRequest, FileRequest } from '@appTypes/auth';
const { activityType } = constants;

export const createSite = async (req: FileRequest, res: Response, next: NextFunction) => {
  try {
    const {
      type,
      wateringNearBy,
      numberOfPlants,
      soilQuality,
      lat,
      lng,
      siteDisplayName,
    } = req.body;

    let uploadedImage = {
      url: '',
      fileName: '',
    };

    if (req.file && req.file !== undefined) {
      uploadedImage = await UploadService.uploadImageToStorage(req.file);
    }
    const siteToAdd = {
      photo: uploadedImage.url,
      photoName: uploadedImage.fileName,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
      },
      type,
      wateringNearBy,
      numberOfPlants,
      soilQuality,
      siteDisplayName,
      createdAt: new Date().getTime(),
      createdBy: req.user.user_id,
      owner: {
        userId: req.user.user_id,
        displayName: req.user.name,
      },
      moderatorApproved: SiteService.addedByModerator(req.user.role),
    };
    SiteService.create(siteToAdd);
    return res.status(httpStatus.OK).json({ message: 'Site added', siteToAdd });
  } catch (e) {
    next(e);
  }
};

export const allSites = (req: Request, res: Response, next: NextFunction) => {
  try {
    SiteService.allSites().then((allSites) => res.status(httpStatus.OK).json(allSites));
  } catch (e) {
    next(e);
  }
};

export const getSites = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req;
    const { lat, lng, radius } = req.query;
    const allSites = await SiteService.fetchSites(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      user
    );
    res.status(httpStatus.OK).json(allSites);
  } catch (e) {
    next(e);
  }
};

export const deleteSite = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { siteID } = req.params;
  try {
    const deletedSite = await SiteService.updateSite(
      siteID,
      {
        delete: {
          deleted: true,
          deletedBy: req.user.user_id,
          isModeratorApproved: SiteService.deletedByModerator(req.user.role),
        },
      },
      activityType.DELETE_SITE
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

export const updateSite = async (req: FileRequest, res: Response, next: NextFunction) => {
  const { siteID } = req.params;
  const siteUpdateBody = {
    ...req.body,
  };

  if (req.file && req.file !== undefined) {
    const { url, fileName } = await UploadService.uploadImageToStorage(req.file);
    siteUpdateBody.photo = url;
    siteUpdateBody.photoName = fileName;
  }

  // uploadedUser never changes
  delete siteUpdateBody.uploadedUser;
  try {
    const updatedSite = await SiteService.updateSite(
      siteID,
      siteUpdateBody,
      activityType.UPDATE_SITE
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

export const modActionOnSite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if ('approve' in req.body) {
      await SiteService.updateModApprovalStatus(req.params.siteID, req.body.approve);
      res.status(httpStatus.OK).json({ status: 'Site approved by moderator' });
    } else if (req.body.deleteApprove) {
      await SiteService.updateModDeleteStatus(req.params.siteID, req.body.deleteApprove);
      res.status(httpStatus.OK).json({ status: 'Delete approved' });
    } else if (!req.body.deleteApprove) {
      await SiteService.rejectSiteDelete(req.params.siteID);
      res.status(httpStatus.OK).json({ status: 'Delete rejected' });
    }
  } catch (e) {
    next(e);
  }
};
