import { copySync } from 'fs-extra';
copySync('./src/ui', './dist/ui');
copySync('./src/dashboard', './dist/dashboard');
