const httpStatus = require('http-status');
const { SiteService } = require('../services/site.service');

exports.createSite = (req, res, next) => {
  try {
    const { sites, ...restSite } = req.body;
    const sitesArr = [];

    for (let i = 0; i < sites; i += 1) {
      sitesArr.push({ ...restSite });
    }
    SiteService.create(sitesArr);
    return res.status(httpStatus.OK).json({ message: 'Site added', sitesArr });
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
