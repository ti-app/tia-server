// create co-ordinate object
// create plant group object
// create user object
// creating arrays of plant groups
// Adding a plant to a new group
// Adding a plant to an existing group
// Fetching a plant from co-ordinates
// Fetching a group of plants from co-ordinates

const latmin = 8.4;
const latmax = 37.6;
const longmin = 97.25;
const longmax = 68.7;
const latinterval = 1000;
const longinterval = 1000;

class TreePoint {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }
}

class PlantObj {
  constructor(
    _lat,
    _long,
    _grp,
    _num,
    _uploaduser,
    _uploaddate,
    _last_act,
    _last_act_user,
    _last_act_type,
    _currenthealth,
    _healthcycle
  ) {
    this.lat = _lat;
    this.long = _long;
    this.grp = _grp;
    this.num = _num;
    this.uploaduser = _uploaduser;
    this.uploaddate = _uploaddate;

    // last activity date
    this.lastact = _last_act;
    // user who performed last activity
    this.lastactuser = _last_act_user;

    // what type of activity performed
    this.last_act_type = _last_act_type;

    this.currenthealth = _currenthealth;

    // Time taken to convert green to red and vice versa.
    // Default is 7 days
    this.healthcycle = _healthcycle;

    // its better to convert latitude longitude into indices
    // Create several id's which should serve different purpose
    // 1. create plant id based on lat long.
    // Helps in searching all plants which lie close to each other in space

    // 2. create plant id based on lat long uploaduserid
    // Helps in searching plants uploaded by a particular user in a particular area

    // 3.create plant id based on lat long and group-id

    // Need to think how to create a new group id
  }
}

// The following function create a string out of lat and long
// This can be one of the indices of Plant Object
function generateid(x, y) {
  var str1 = x.toString();
  var str2 = y.toString();
  return str1.concat(str2);
}

// The following function create a string out of lat, long and group id
// This can be a second index for every Plant Object
function generateidgrp(x, y, i) {
  var str1 = generateid(x, y);
  var str2 = str1.concat(i.toString());
  return str2;
}

// The following function returns an index where the plant belongs as per lat and long
function varIndex(min, max, numint, value) {
  let index = -1;
  let interval = (max - min) / numint;
  console.log('interval' + interval);
  if (value < min) {
    index = 0;
  } else if (value > max) {
    index = numint;
  } else if (value >= min && value <= max) {
    index = Math.floor((value - min) / interval);
  }

  console.log('index  ' + index);
  return index;
}
// generate coordinate of a group of plants in a line..
// This function creates Group based on two end points
// Please make necessary changes to update following entities of Plant Object
// Grp?, Number, UploadUser, UploadDate, Last activity, Last activity User
function generateTreeCoordsForLine(startPoint, endPoint, numPlants) {
  const inilat = startPoint.lat;
  const inilon = startPoint.lon;
  const finallat = endPoint.lat;
  const finallon = endPoint.lon;
  const num = numPlants;
  const trees = [];

  // var delta2 = Math.pow(finallat - inilat, 2) + Math.pow(finallon - inilon, 2);
  // var delta = Math.pow(delta2, 0.5) / (num - 2);
  const firstTree = new TreePoint(inilat, inilon);
  // firstTree.lat = inilat;
  // firstTree.long = inilon;
  trees.push(firstTree);
  for (let i = 1; i < num - 1; i++) {
    const term1 = (num - 2) * (finallat - inilat);
    const xc = inilat + term1;
    const term2 = (num - 2) * (finallon - inilon);
    const yc = inilon + term2;
    const aTree = new TreePoint(xc, yc);
    // aTree.lat = xc;
    // aTree.long = yc;
    trees.push(aTree);
  }
  const lastTree = new TreePoint(finallat, finallon);
  // lastTree.lat = finallat;
  // lastTree.long = finallon;
  trees.push(lastTree);
  return trees;
}

// generate coordinate of a group of plants in a line..
// This function creates Group based on One end point, one direction and spacing between plants
// +ve X means direction east
// -ve X means direction west
// +ve Y means direction north
// -ve Y means direction south
// Please make necessary changes to update following entities of Plant Object
// Grp?, Number, UploadUser, UploadDate, Last activity, Last activity User
function generatecoordforgroup2(obj) {
  var startlat = obj.startlat;
  var startlong = obj.startlong;
  var dirx = obj.dirx;
  var diry = obj.diry;
  var num = obj.numplants;
  var spacing = obj.spacing;
  var grpcoord = new PlantObj();
  var coordArray = [];
  var i;
  var xc, yc, term1, term2;
  var lenvec2 = Math.pow(dirx, 2) + Math.pow(diry, 2);
  var lenvec = Math.pow(lenvec2, 0.5);
  var unitx = (spacing * dirx) / lenvec;
  var unity = (spacing * diry) / lenvec;
  grpcoord.lat = inilat;
  grpcoord.long = inilon;
  coordArray.push(grpcoord);
  for (i = 1; i < num; i++) {
    xc = inilat + i * unitx;
    yc = inilon + i * unity;
    grpcoord.lat = xc;
    grpcoord.long = yc;
    coordArray.push(grpcoord);
  }
  return coordArray;
}

// generate coordinate of a group of plants in a rectangular area.
// This function creates Group based on Two diagonal points,
// and spacing in X and Y direction
// First diagonal point is Xmin, Ymin
// Second diagonal point is Xmax, Ymax
// Its a uniform pattern with fixed rows and columns
// Please make necessary changes to update following entities of Plant Object
// Grp?, Number, UploadUser, UploadDate, Last activity, Last activity User
function generateTreeCoordsForRect(obj) {
  // Please sort out min and max before this point.
  // Below this code its not being checked if min<max or not
  var xmin = obj.xmin;
  var ymin = obj.ymin;
  var xmax = obj.xmax;
  var ymax = obj.ymax;
  var numrows = obj.numrows;
  var numcolumns = obj.numcolumns;
  var grpcoord = new PlantObj();
  var coordArray = [];
  var i, j;
  var xc, yc;
  for (i = 0; i < numrows - 1; i++) {
    for (j = 0; j < numcolumns; j++) {
      xc = xmin + (i * (xmax - xmin)) / (numrows - 1);
      yc = ymin + (j * (ymax - ymin)) / (numcolumns - 1);
      grpcoord.lat = xc;
      grpcoord.long = yc;
      coordArray.push(grpcoord);
    }
  }
  return coordArray;
}

// generate coordinate of a group of plants in a rectangular area.
// This function creates Group based on Two diagonal points,
// and Number of plants to be distributed randomly in the area
// First diagonal point is Xmin, Ymin
// Second diagonal point is Xmax, Ymax
// Its a random pattern
// Please make necessary changes to update following entities of Plant Object
// Grp?, Number, UploadUser, UploadDate, Last activity, Last activity User
// By default two plants added at (xmin,ymin) and (xmax,ymax) locations.
function generatecoordforgroup4(obj) {
  var xmin = obj.xmin;
  var ymin = obj.ymin;
  var xmax = obj.xmax;
  var ymax = obj.ymax;
  var num = obj.numplants;
  var grpcoord = new PlantObj();
  var coordArray = [];

  grpcoord.lat = xmin;
  grpcoord.long = ymin;
  coordArray.push(grpcoord);
  for (let i = 1; i < num - 1; i++) {
    const xc = xmin + Math.random() * (xmax - xmin);
    const yc = ymin + Math.random() * (ymax - ymin);
    grpcoord.lat = xc;
    grpcoord.long = yc;
    coordArray.push(grpcoord);
  }
  grpcoord.lat = xmax;
  grpcoord.long = ymax;
  coordArray.push(grpcoord);
  return coordArray;
}

// generate coordinate of a group of plants in a circular area.
// This function creates Group based on center point and radius
// and Number of plants to be distributed randomly in the area
// First input of the object is centroid with Xc, Yc
// Second input is radius
// Its a random pattern with specified number of plants
// The first plant to be added is at the centre of the circle
// Please make necessary changes to update following entities of Plant Object
// Grp?, Number, UploadUser, UploadDate, Last activity, Last activity User
function generateTreeCoordsForCircle(centerX, centerY, radius, numPlants) {
  const xcen = centerX;
  const ycen = centerY;
  const rad = radius;
  const num = numPlants;
  const trees = [];

  const firstTree = new TreePoint(xcen, ycen);
  trees.push(firstTree);
  for (let i = 1; i < num; i++) {
    const localrad = Math.random() * rad;
    const localtheta = Math.random() * 6.28;
    const xc = Math.cos(localtheta) * localrad;
    const yc = Math.sin(localtheta) * localrad;
    const aTree = new TreePoint(xc, yc);
    trees.push(aTree);
  }
  return trees;
}

// generate coordinate of a group of plants in a circular area.
// This function creates Group based on three points on the circumference
// All three points happen to be holding one plant each
// and Number of plants to be distributed randomly in the area
// Its a random pattern with specified number of plants
// Please make necessary changes to update following entities of Plant Object
// Grp?, Number, UploadUser, UploadDate, Last activity, Last activity User
function generatecoordforgroup6(obj) {
  var x1 = obj.x1;
  var y1 = obj.y1;
  var x2 = obj.x2;
  var y2 = obj.y2;
  var x3 = obj.x3;
  var y3 = obj.y3;
  var num = obj.numplants;
  var grpcoord = new PlantObj();
  var coordArray = [];
  var i;
  var xc, yc, localrad, localtheta, xcen, ycen;
  grpcoord.lat = x3;
  grpcoord.long = y3;
  coordArray.push(grpcoord);
  grpcoord.lat = x1;
  grpcoord.long = y1;
  coordArray.push(grpcoord);
  grpcoord.lat = x2;
  grpcoord.long = y2;
  coordArray.push(grpcoord);
  var x12y12 = Math.pow(x1, 2) + Math.pow(y1, 2);
  var x22y22 = Math.pow(x2, 2) + Math.pow(y2, 2);
  var x32y32 = Math.pow(x3, 2) + Math.pow(y3, 2);
  var matrixA = [[x1, y1, 1], [x2, y2, 1], [x3, y3, 1]];
  var matrixB = [[x12y12, y1, 1], [x22y22, y2, 1], [x32y32, y3, 1]];
  var matrixC = [[x12y12, x1, 1], [x22y22, x2, 1], [x32y32, x3, 1]];
  var matrixD = [[x12y12, x1, y1], [x22y22, x2, y2], [x32y32, x3, y3]];
  var A = Math.det(matrixA);
  var B = -1 * Math.det(matrixA);
  var C = Math.det(matrixA);
  var D = -1 * Math.det(matrixA);
  xcen = -B / 2 / A;
  ycen = (-0.5 * C) / A;
  var B2 = Math.pow(B, 2);
  var C2 = Math.pow(C, 2);
  var AD = A * D;
  var A2 = A * A;
  var rad = Math.pow((B2 + C2 - 4 * AD) / (4 * A2), 0.5);
  for (i = 1; i < num - 2; i++) {
    localrad = Math.random() * rad;
    localtheta = Math.random() * 6.28;
    xc = Math.cos(localtheta) * localrad;
    yc = Math.sin(localtheta) * localrad;
    grpcoord.lat = xc;
    grpcoord.long = yc;
    coordArray.push(grpcoord);
  }
  return coordArray;
}

module.exports = {
  generateTreeCoordsForLine,
  generateTreeCoordsForRect,
  generateTreeCoordsForCircle,
};
