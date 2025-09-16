const Req = require('../models/IngredientRequest');

exports.request = async (req, res) => {
  try {
    console.log('Ingredient request received from user:', {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
      branch: req.user.branch
    });
    console.log('Request body:', req.body);

    // Add the requesting user's information to the request
    const requestData = {
      ...req.body,
      requestedBy: req.user.username || req.user.email || req.user.id,
      // If user has a branch, use it; otherwise use the branch from request body
      branch: req.user.branch || req.body.branch
    };

    console.log('Creating ingredient request:', requestData);
    const request = new Req(requestData);
    await request.save();
    console.log('Ingredient request created successfully:', request);
    res.json(request);
  } catch (error) {
    console.error('Error creating ingredient request:', error);
    res.status(500).json({ 
      message: 'Error creating ingredient request',
      error: error.message 
    });
  }
};

exports.list = async (req, res) => {
  try {
    let query = {};
    
    // If user is not admin, filter by their branch
    if (req.user.role !== 'admin') {
      query.branch = req.user.branch;
    }
    
    console.log('Fetching ingredient requests with query:', query);
    const requests = await Req.find(query).sort({ date: -1 });
    console.log(`Found ${requests.length} ingredient requests`);
    res.json(requests);
  } catch (error) {
    console.error('Error fetching ingredient requests:', error);
    res.status(500).json({ 
      message: 'Error fetching ingredient requests',
      error: error.message 
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user can update this request (admin or owner)
    if (req.user.role !== 'admin') {
      const existingRequest = await Req.findById(id);
      if (!existingRequest) {
        return res.status(404).json({ message: 'Ingredient request not found' });
      }
      if (existingRequest.branch !== req.user.branch) {
        return res.status(403).json({ message: 'Not authorized to update this request' });
      }
    }
    
    console.log('Updating ingredient request:', id, req.body);
    const request = await Req.findByIdAndUpdate(id, req.body, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Ingredient request not found' });
    }
    console.log('Ingredient request updated successfully:', request);
    res.json(request);
  } catch (error) {
    console.error('Error updating ingredient request:', error);
    res.status(500).json({ 
      message: 'Error updating ingredient request',
      error: error.message 
    });
  }
};


exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    console.log('Updating ingredient request status:', id, status);
    const request = await Req.findByIdAndUpdate(id, { status }, { new: true });
    if (!request) {
      return res.status(404).json({ message: 'Ingredient request not found' });
    }
    console.log('Ingredient request status updated successfully:', request);
    res.json(request);
  } catch (error) {
    console.error('Error updating ingredient request status:', error);
    res.status(500).json({ 
      message: 'Error updating ingredient request status',
      error: error.message 
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if user can delete this request (admin or owner)
    if (req.user.role !== 'admin') {
      const existingRequest = await Req.findById(id);
      if (!existingRequest) {
        return res.status(404).json({ message: 'Ingredient request not found' });
      }
      if (existingRequest.branch !== req.user.branch) {
        return res.status(403).json({ message: 'Not authorized to delete this request' });
      }
    }
    
    console.log('Deleting ingredient request:', id);
    const request = await Req.findByIdAndDelete(id);
    if (!request) {
      return res.status(404).json({ message: 'Ingredient request not found' });
    }
    console.log('Ingredient request deleted successfully');
    res.json({ message: 'Ingredient request deleted successfully' });
  } catch (error) {
    console.error('Error deleting ingredient request:', error);
    res.status(500).json({ 
      message: 'Error deleting ingredient request',
      error: error.message 
    });
  }
};
