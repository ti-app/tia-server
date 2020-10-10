import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import TreeGroupService from '@services/tree-group.service';
import TreeService from '@services/tree.service';
import UploadService from '@services/upload.service';
import TreeActivityService from '@services/tree-activity.service';
import constants from '@constants';
import toArray from '@utils/to-array';
import { toTreeHealthValue, keyExists } from '@utils/common-utils';
import { AuthRequest, CreateTreeGroupRequest, ModActionRequest } from '@appTypes/requests';
import APIError from '@utils/APIError';
import { getCenterOfCoordinates } from '@utils/turf';
import userService from '@services/user.service';

import fs from 'fs';

const { activityType, treeHealth } = constants;

export const createTreeGroup = async (
  req: CreateTreeGroupRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { health, waterCycle, trees, distribution, plantType } = req.body;
    // const isTreeExist = await TreeGroupService.isTreeExistOnCoordinate(lat, lng);
    // if (isTreeExist && !isCoordinateExists) {
    //   const isCoordinateExists = true;
    //   return res.status(httpStatus.ALREADY_REPORTED).json({
    //     message: `Tree/ site Already exists on the request location. If you still wants to plant click on yes, click on NO and add the plant again.`,
    //     isCoordinateExists,
    //   });
    // }

    // if (isCoordinateExists) {
    //   TreeService.updateTree(req.body);
    // }

    let uploadedImage = {
      url: '',
      fileName: '',
    };

    if (req.file && req.file !== undefined) {
      uploadedImage = await UploadService.uploadImageToStorage(req.file);
    }

    const distributedTrees = trees; // [{},{},...]
    // const treeGroupLocation = distributedTrees[0]; // a location for tree group marker
    const treeGroupLocation = getCenterOfCoordinates(distributedTrees); // a location for tree group marker

    // const distributedTrees = JSON.parse(trees); // [{},{},...]
    // const treeGroupLocation = distributedTrees[0]; // a location for tree group marker

    const commonValues = {
      photo: uploadedImage.url,
      photoName: uploadedImage.fileName,
      health,
      plantType,
      healthCycle: Math.round(waterCycle),
      healthValue: toTreeHealthValue(health),
      createdAt: new Date().getTime(),
      createdBy: req.user.user_id,
      lastActivityDate: new Date().getTime(),
      lastActedUser: req.user.user_id,
      lastActivityType: activityType.ADD_TREE,
      owner: {
        userId: req.user.user_id,
        displayName: req.user.name || req.user.email,
      },
    };

    const treeGroup = {
      ...commonValues,
      location: {
        type: 'Point',
        coordinates: treeGroupLocation,
        // coordinates: [parseFloat(treeGroupLocation.lng), parseFloat(treeGroupLocation.lat)],
      },
      activeTrees: true,
      distribution,
      moderatorApproved: TreeGroupService.addedByModerator(req.user.role),
    };

    const treeGroupResult = await TreeGroupService.createTreeGroup(treeGroup);
    const groupId = treeGroupResult.insertedId;

    // const numTrees = distributedTrees.length;
    // const trees = [];
    // for (let i = 0; i < numTrees; i += 1) {
    //   const aTreeToAdd = Object.assign({}, treeGroup);
    //   // delete aTreeToAdd.moderatorApproved;
    //   // treeGroup is getting mutated by insert method..i guess, as it is having _id
    //   delete aTreeToAdd._id;
    //   aTreeToAdd.groupId = groupId;
    //   trees.push(aTreeToAdd);
    // }

    const treesToBeAddedToGroup = distributedTrees.map((aTree: any) => ({
      ...commonValues,
      groupId,
      location: {
        type: 'Point',
        coordinates: [parseFloat(aTree.lng), parseFloat(aTree.lat)],
      },
    }));

    const multipleTreeAddResult = await TreeService.addMultipleTrees(treesToBeAddedToGroup);
    await TreeGroupService.addTreesToGroup(
      toArray(multipleTreeAddResult.insertedIds),
      groupId.toString()
    );

    await TreeActivityService.addTreeActivity(
      toArray(multipleTreeAddResult.insertedIds),
      activityType.ADD_TREE,
      true
    );
    res.status(httpStatus.OK).json({ groupId });
  } catch (e) {
    next(e);
  }
};

export const getTreeGroups = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { user } = req;

    const { lat, lng, radius, health, user_location } = req.query;

    if (user_location && user_location === 'true') {
      await userService.saveUserLocation(user.uid, parseFloat(lat), parseFloat(lng));
    }

    const allTreeGroups = await TreeGroupService.fetchTreeGroups(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius),
      health,
      user
    );
    res.status(httpStatus.OK).json(allTreeGroups);
  } catch (e) {
    next(e);
  }
};

export const modActionOnTreeGroup = async (
  req: ModActionRequest,
  res: Response,
  next: NextFunction
) => {
  const shouldApprove = req.body.approve;
  const shouldDelete = req.body.deleteApprove;

  try {
    // if both options or none are specified in request, throw error
    if (keyExists('approve', req.body) && keyExists('deleteApprove', req.body)) {
      throw new APIError({
        message: 'Invalid Request. Only one mod action is possible at a time.',
        status: httpStatus.BAD_REQUEST,
      });
    } else if (Object.keys(req.body).length === 0) {
      throw new APIError({
        message: 'Invalid Request. No action is specified.',
        status: httpStatus.BAD_REQUEST,
      });
    }

    if (keyExists('approve', req.body)) {
      const modActionRes = await TreeGroupService.updateModApprovalStatus(
        req.params.groupID,
        shouldApprove
      );

      res
        .status(httpStatus.OK)
        .json({ status: `Tree Group ${shouldApprove ? 'approved' : 'rejected'} by moderator.` });
    } else if (keyExists('deleteApprove', req.body)) {
      if (shouldDelete) {
        await TreeGroupService.updateModDeleteStatus(req.params.groupID, shouldDelete);
      } else {
        await TreeGroupService.rejectTreeGroupDelete(req.params.groupID);
      }
      res
        .status(httpStatus.OK)
        .json({ status: `Delete request ${shouldDelete ? 'approved' : 'rejected'}.` });
    }
  } catch (e) {
    next(e);
  }
};

export const deleteTreeGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    await TreeGroupService.deleteTreeGroup(req.params.groupID);
    res.status(httpStatus.OK).json({ status: 'success' });
  } catch (e) {
    next(e);
  }
};

export const waterTreeGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { groupID } = req.params;
  try {
    await TreeGroupService.updateTreeGroup(groupID, {
      health: treeHealth.HEALTHY,
      healthValue: toTreeHealthValue(treeHealth.HEALTHY),
    });

    await TreeGroupService.waterTreesOfGroup(groupID);

    res.status(httpStatus.OK).json({ status: 'success' });
  } catch (e) {
    next(e);
  }
};

export const getTreeGroupClusters = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { bbox } = req.query;
    const allTreeGroupClusters = await TreeGroupService.fetchTreeGroupClusters(bbox);
    res.status(httpStatus.OK).json(allTreeGroupClusters);
  } catch (e) {
    next(e);
  }
};
export const waterMultipleTreeGroups = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const { treeGroups } = req.body;

  try {
    await TreeGroupService.updateMultipleTreeGroup(treeGroups, {
      health: treeHealth.HEALTHY,
      healthValue: toTreeHealthValue(treeHealth.HEALTHY),
    });

    await TreeGroupService.waterTreesOfMultipleGroups(treeGroups);

    res.status(httpStatus.OK).json({ status: 'success', updatedTreeGroups: treeGroups });
  } catch (e) {
    next(e);
  }
};
