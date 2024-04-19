const express = require('express');
const router = express.Router();  // Use 'router' instead of 'app' for clarity
const Group = require('../models/group.model'); // Adjust the path as necessary

// Define routes using 'router' instead of 'app'
router.post('/group', async (req, res) => {
    const { name, description, members } = req.body;
    if (!name || !description || typeof members !== 'number' || members < 1) {
        return res.status(400).json({ message: "Invalid data provided" });
    }
    
    const newGroup = new Group({
        name,
        description,
        members
    });

    try {
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/group', async (req, res) => {
    const { page = 1, limit = 10 } = req.query; // default page 1 and limit 10
    try {
        const groups = await Group.find()
                                  .limit(limit * 1)
                                  .skip((page - 1) * limit)
                                  .exec();
        const count = await Group.countDocuments();
        res.json({
            groups,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.patch('/group/:id', async (req, res) => {
    const updates = req.body;
    const allowedUpdates = ['name', 'description', 'members'];  // Only allow these fields to be updated
    const isValidOperation = Object.keys(updates).every((update) => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates!' });
    }

    try {
        const updatedGroup = await Group.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!updatedGroup) {
            return res.status(404).json({ message: 'Group not found' });
        }
        res.json(updatedGroup);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


router.delete('/group/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }
        await group.remove();
        res.json({ message: 'Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;
