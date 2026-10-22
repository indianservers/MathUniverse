import {pathToFileURL} from 'node:url';import{resolve}from'node:path';const{verifySheet}=await import(pathToFileURL(resolve('scripts/verify-spreadsheet-lesson.mjs')).href);await verifySheet(416);
