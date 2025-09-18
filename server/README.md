Server run: cd server && npm install && copy .env.example to .env && npm run seed && npm run dev

Environment variables:

Create a file at `.env` with the following contents (or copy from `.env.example`):

MONGO_URI=mongodb://localhost:27017/icecream_shop
JWT_SECRET=please-change-me
PORT=5002
