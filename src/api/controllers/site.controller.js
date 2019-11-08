const httpStatus = require('http-status');
const SiteService = require('../services/site.service');
const UploadService = require('../services/upload.service');
const { activityType } = require('../../constants');

exports.createSite = async (req, res, next) => {
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

exports.allSites = (req, res, next) => {
  try {
    SiteService.allSites().then((allSites) => res.status(httpStatus.OK).json(allSites));
  } catch (e) {
    next(e);
  }
};

exports.getSites = async (req, res, next) => {
  try {
    const { uid } = req;
    const { lat, lng, radius } = req.query;
    const allSites = await SiteService.fetchSites(lat, lng, radius, uid);
    res.status(httpStatus.OK).json(allSites);
  } catch (e) {
    next(e);
  }
};

exports.deleteSite = async (req, res, next) => {
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
      activityType.deleteSite
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

exports.updateSite = async (req, res, next) => {
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
      activityType.updateSite
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

exports.modActionOnSite = async (req, res, next) => {
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
