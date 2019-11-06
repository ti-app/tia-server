// import customModuleLoader = require('module');

// export class CustomModuleLoader {
//   public cOptions: any = require('../tsconfig.json').compilerOptions;

//   public replacePaths: any = {};

//   constructor() {
//     Object.keys(this.cOptions.paths).forEach((alias) => {
//       this.replacePaths[alias.replace(/\*.?/, '(.*)')] = this.cOptions.paths[alias][0].replace(
//         /\*.?/,
//         '$1'
//       );
//     });

//     console.log(this.replacePaths);

//     (<any>customModuleLoader)._originalResolveFilename = (<any>customModuleLoader)._resolveFilename;

//     (<any>customModuleLoader)._resolveFilename = (
//       request: string,
//       parent: customModuleLoader,
//       isMain: boolean
//     ) => {
//       Object.keys(this.replacePaths).forEach((matchString) => {
//         let regex = new RegExp(matchString);
//         if (request.match(regex)) {
//           console.log('TCL: CustomModuleLoader -> constructor -> regex', regex);
//           console.log('TCL: CustomModuleLoader -> constructor -> request', request);
//           request = [
//             process.cwd(),
//             this.cOptions.outDir,
//             request.replace(regex, this.replacePaths[matchString]),
//           ].join('/');
//           console.log('TCL: CustomModuleLoader -> constructor -> request', request);
//         }
//       });
//       return (<any>customModuleLoader)._originalResolveFilename(request, parent, isMain);
//     };
//   }
// }

import moduleAlias from 'module-alias';

const cOptions: any = require('../tsconfig.json').compilerOptions;

export class CustomModuleLoader {
  cOptions: any = require('../tsconfig.json').compilerOptions;

  constructor() {
    const aliasBuildPath = `${process.cwd()}/${this.cOptions.outDir}`;
    moduleAlias.addAliases({
      '@appTypes': `${aliasBuildPath}/types`,
      '@constants': `${aliasBuildPath}/constants/index.js`,
      '@logger': `${aliasBuildPath}/config/logger.js`,
      '@utils': `${aliasBuildPath}/api/utils`,
    });
  }
}
