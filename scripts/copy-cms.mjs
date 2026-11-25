// Zkopíruje Sveltia CMS z node_modules do public/admin/cms, aby administrace nezávisela na cizí CDN.
import { cpSync, mkdirSync } from 'node:fs';
mkdirSync('public/admin/cms', { recursive: true });
cpSync('node_modules/@sveltia/cms/dist', 'public/admin/cms', { recursive: true });
console.log('Sveltia CMS zkopírováno do public/admin/cms');
