const r = require('express').Router();
const ctrl = require('../controllers/salesController');
const { authMiddleware } = require("../middleware/auth");


r.get('/', authMiddleware, ctrl.list);  // ✅ Both Admin & User can view sales
r.post('/', authMiddleware, ctrl.create);
r.put('/:id', authMiddleware, ctrl.update);
r.delete('/:id', authMiddleware, ctrl.delete);

module.exports = r;