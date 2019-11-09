import { Request, Response, NextFunction } from 'express';
import { Body, Controller, Get, Header, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import httpStatus from 'http-status';
import TreeService from '@services/tree.service';
import TreeActivityService from '@services/tree-activity.service';
import TreeGroupService from '@services/tree-group.service';
import UploadService from '@services/upload.service';

import constants from '@constants';
import { toTreeHealth, toTreeHealthValue } from '@utils/common-utils';
import { AuthRequest, FileRequest } from '@appTypes/auth';

const { activityType, treeHealth } = constants;

export const waterTree = async (req: Request, res: Response, next: NextFunction) => {
  const { treeId } = req.params;
  try {
    const updatedTree = await TreeService.updateTree(
      treeId,
      {
        health: treeHealth.HEALTHY,
        healthValue: toTreeHealthValue(treeHealth.HEALTHY),
        lastActivityDate: new Date().getTime(),
        lastActivityType: activityType.WATER_TREE,
      },
      activityType.WATER_TREE
    );

    const result = await TreeGroupService.getTreesOfGroup(treeId);
    const { _id: groupId, trees } = result[0].group;

    let minHealth = Number.POSITIVE_INFINITY;

    trees.forEach((aTree: any) => {
      if (aTree.healthValue < minHealth) {
        minHealth = aTree.healthValue;
      }
    });

    const updatedTreGroupRes = await TreeGroupService.updateTreeGroup(groupId, {
      health: toTreeHealth(minHealth),
      healthValue: minHealth,
    });

    res.status(httpStatus.OK).json({ status: 'success' });
  } catch (e) {
    next(e);
  }
};

export const deleteTree = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const { treeId } = req.params;
  try {
    const deletedTree = await TreeService.updateTree(
      treeId,
      {
        delete: {
          deleted: true,
          deletedBy: req.user.user_id,
          isModeratorApproved: TreeService.deletedByModerator(req.user.role),
        },
      },
      activityType.DELETE_TREE
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

export const updateTree = async (req: FileRequest, res: Response, next: NextFunction) => {
  const { treeId } = req.params;
  const treeUpdateBody = {
    ...req.body,
  };

  if (req.file && req.file !== undefined) {
    const { url, fileName } = await UploadService.uploadImageToStorage(req.file);
    treeUpdateBody.photo = url;
    treeUpdateBody.photoName = fileName;
  }

  // uploadedUser never changes
  delete treeUpdateBody.uploadedUser;
  try {
    const updatedTree = await TreeService.updateTree(
      treeId,
      treeUpdateBody,
      activityType.UPDATE_TREE
    );

    res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (e) {
    next(e);
  }
};

export const modActionOnTree = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.body.deleteApprove) {
      await TreeService.updateModDeleteStatus(req.params.treeId, req.body.deleteApprove);
      res.status(httpStatus.OK).json({ status: 'Delete approved' });
    } else {
      await TreeService.rejectTreeDelete(req.params.treeId);
      res.status(httpStatus.OK).json({ status: 'Delete rejected' });
    }
  } catch (e) {
    next(e);
  }
};

export const treeActivity = async (req: Request, res: Response, next: NextFunction) => {
  const { treeId } = req.params;
  try {
    const treeActivity = await TreeActivityService.getTreeActivity(treeId);
    res.status(httpStatus.OK).json(treeActivity);
  } catch (e) {
    next(e);
  }
};
