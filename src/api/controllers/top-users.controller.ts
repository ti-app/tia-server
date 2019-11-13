import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import TopUsersService from '@services/top-users.service';
import { getUserInfoFromUid } from '@utils/firebase.utils';
import _ from 'lodash';

import constants from '@constants';

export const topUsers = async (req: Request, res: Response, next: NextFunction) => {
  const { limit } = req.query;
  try {
    const topUsers = await TopUsersService.getTopUsers(parseInt(limit));
    const userIds = _.map(topUsers, '_id');
    const userInfoArry: any[] = [];
    userIds.forEach((uid) => {
      userInfoArry.push(getUserInfoFromUid(uid));
    });
    const topUsersArrayWithFirebaseInfo: any[] = [];
    await Promise.all(userInfoArry).then((userInfoArr) => {
      console.log(userInfoArr);
      _.map(topUsers, (topUser) => {
        const userInfo = _.find(userInfoArr, { uid: topUser._id });
        topUser.displayName = userInfo.displayName;
        topUser.photoUrl = userInfo.photoURL;
        topUsersArrayWithFirebaseInfo.push(topUser);
      });
    });

    res.status(httpStatus.OK).json(topUsersArrayWithFirebaseInfo);
  } catch (e) {
    next(e);
  }
};
