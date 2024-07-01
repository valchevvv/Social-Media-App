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

        if (route.default.stack) {
            route.default.stack.forEach((layer: any) => {
                if (layer.route) {
                    Object.keys(layer.route.methods).forEach(method => {
                        console.log(`Method: ${method.toUpperCase()}, Path: /api/${file.split('Routes')[0]}${layer.route.path}`);
                    });
                }
            });
        }
    }
});
};

export default loadRoutes;
