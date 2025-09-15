const r = require('express').Router();
const ctrl = require('../controllers/ingredientController');
const auth = require('../middleware/authMiddleware');

r.get('/', auth(), ctrl.list);
r.post('/', auth(), ctrl.request); // Allow both admin and branch users to create requests
r.put('/:id', auth(['admin']), ctrl.update);
r.patch('/:id', auth(['admin']), ctrl.updateStatus); // Add PATCH endpoint for status updates
r.delete('/:id', auth(['admin']), ctrl.delete);

module.exports = r;