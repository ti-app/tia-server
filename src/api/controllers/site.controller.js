const httpStatus = require('http-status');
const { SiteService } = require('../services/site.service');

exports.createSite = (req, res, next) => {
  try {
    const { site } = req.body;
    const siteToAdd = { ...site };
    siteToAdd.addedByUser = req.uid.user_id;
    siteToAdd.location = {
      type: 'Point',
      coordinates: [parseFloat(site.location.lng), parseFloat(site.location.lat)],
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
