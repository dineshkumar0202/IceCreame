
Changes applied:
- auth route: login now returns 404 if user not found; only 'admin' can login (403 if not admin).
- seed.js: replaced with a clean seeder that creates admin and sample branches/sales/requests.

To use:
1) Ensure MongoDB is running and .env MONGO_URI is correct.
2) From server folder: npm install (if not done), then run: node src/seed.js
3) Start server: npm run dev
4) Client: npm install && npm run dev

If you prefer that non-admin users can create ingredient requests, tell me and I will re-enable user logins for that route only.
