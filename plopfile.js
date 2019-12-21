/* eslint-disable @typescript-eslint/explicit-function-return-type */
module.exports = (plop) => {
  plop.setGenerator('Route + Controller + Service + Repo file', {
    description: 'A route with controller, service and db query function',
    prompts: [
      {
        type: 'list',
        name: 'version',
        message: 'Select API Version:',
        choices: ['v1'],
        default: 'v1',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Route name:',
        validate: (value) => {
          return value.length !== 0;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/api/routes/{{version}}/{{name}}.route.ts',
        templateFile: 'plop-templates/route.template.ts',
      },
      {
        type: 'add',
        path: 'src/api/controllers/{{name}}.controller.ts',
        templateFile: 'plop-templates/controller.template.ts',
      },
      {
        type: 'add',
        path: 'src/api/services/{{name}}.service.ts',
        templateFile: 'plop-templates/service.template.ts',
      },
      {
        type: 'add',
        path: 'src/api/repository/mongo/collection/{{name}}.collection.ts',
        templateFile: 'plop-templates/repository.template.ts',
      },
      {
        type: 'append',
        path: 'src/api/routes/{{version}}/index.ts',
        pattern: /import express from 'express';/gi,
        template: `import {{camelCase name}}Routes from './{{name}}.route';`,
      },
      {
        type: 'append',
        path: 'src/api/routes/{{version}}/index.ts',
        pattern: /const router = express\.Router\(\);/gi,
        template: `router.use('/{{name}}', {{camelCase name}}Routes)`,
      },
    ],
  });
};
