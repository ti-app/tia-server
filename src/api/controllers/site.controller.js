const httpStatus = require('http-status');
const SiteService = require('../services/site.service');
const UploadService = require('../services/upload.service');
const { activityType } = require('../../constants');

exports.createSite = async (req, res, next) => {
  try {
    const { type, wateringNearBy, numberOfPlants, soilQuality, lat, lng } = req.body;

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
      addedByUser: req.uid.user_id,
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
