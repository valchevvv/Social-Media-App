import { Application } from 'express';
import fs from 'fs';
import path from 'path';

const loadRoutes = (app: Application) => {
    const routesPath = path.join(__dirname, 'routes');

    fs.readdirSync(routesPath).forEach((file) => {
        if (file.endsWith('.ts') || file.endsWith('.js')) {
            const route = require(path.join(routesPath, file));
            console.log(`Loading route: /api/${file.split('Routes')[0]}`);
            app.use(`/api/${file.split('Routes')[0]}`, route.default);
        }
    });
};

export default loadRoutes;
