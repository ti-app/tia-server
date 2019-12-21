import express from 'express';
import { get{{pascalCase name}} } from '../../controllers/{{name}}.controller'

const router = express.Router();

router.route('/').get(get{{pascalCase name}});

export default router;
