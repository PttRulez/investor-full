### Deploy
- in root folder 			- `npm install`
- ./packages/databse 	- `npm run db:prod`
- in root folder 			- `npm run build`
- in root folder 			- `npm run start`

**copying .env files:**
- `cp /var/www/env-files/investor/.env.package.database /var/www/pttrulez-subdomains/investor-full/packages/database/.env`

- `cp /var/www/env-files/investor/.env.app.next-client /var/www/pttrulez-subdomains/investor-full/apps/client/.env`

- `cp /var/www/env-files/investor/.env.app.nest-server /var/www/pttrulez-subdomains/investor-full/apps/server/.env`