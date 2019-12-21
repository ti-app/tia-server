import 'reflect-metadata';
import sinon from 'sinon';
import supertestRequest from 'supertest';
import app from '../src/config/express';
import { MongoClient } from '../src/api/repository';

import * as firebaseUtils from '../src/api/utils/firebase.utils';
const firebaseStub = sinon.stub(firebaseUtils, 'getFirebaseUidFromToken');

const request = supertestRequest.agent(app);

export { app, request, firebaseStub, MongoClient };
