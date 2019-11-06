import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import TreeGroupService from '../services/tree-group.service';
import TreeService from '../services/tree.service';
import UploadService from '../services/upload.service';
import TreeActivityService from '../services/tree-activity.service';
import constants from '@constants';
import toArray from '@utils/to-array';
import { toTreeHealthValue } from '@utils/common-utils';
import { AuthRequest, FileRequest } from '@appTypes/auth';
import { parse } from 'dotenv';

const { activityType, treeHealth } = constants;

export const createTreeGroup = async (req: FileRequest, res: Response, next: NextFunction) => {
  try {
    const { isCoordinateExists, health, plantType, waterCycle, trees, distribution } = req.body;

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

    const distributedTrees = JSON.parse(trees); // [{},{},...]
    const treeGroupLocation = distributedTrees[0]; // a location for tree group marker

    const commonValues = {
      photo: uploadedImage.url,
      photoName: uploadedImage.fileName,
      health,
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
        coordinates: [parseFloat(treeGroupLocation.lng), parseFloat(treeGroupLocation.lat)],
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
      plantType,
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
    const { lat, lng, radius, health } = req.query;
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

export const modActionOnTreeGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (req.body.approve) {
      await TreeGroupService.updateModApprovalStatus(req.params.groupID, req.body.approve);
      res.status(httpStatus.OK).json({ status: 'Tree Group approved by moderator' });
    } else if (req.body.deleteApprove) {
      await TreeGroupService.updateModDeleteStatus(req.params.groupID, req.body.deleteApprove);
      res.status(httpStatus.OK).json({ status: 'Delete approved' });
    } else if (!req.body.deleteApprove) {
      await TreeGroupService.rejectTreeGroupDelete(req.params.groupID);
      res.status(httpStatus.OK).json({ status: 'Delete rejected' });
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