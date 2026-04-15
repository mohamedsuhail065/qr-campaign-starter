import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();

router.patch('/:id/instagram', async (req, res) => {
  try {
    await Lead.findByIdAndUpdate(req.params.id, { clickedInstagram: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, mobile, answer, campaignSlug, ref } = req.body;

    if (!name?.trim()) return res.status(400).json({ message: 'Name is required' });
    if (!mobile?.trim()) return res.status(400).json({ message: 'Mobile number is required' });
    if (!/^[0-9]{10,15}$/.test(mobile.trim())) {
      return res.status(400).json({ message: 'Enter a valid mobile number' });
    }
    if (!answer?.trim()) return res.status(400).json({ message: 'Answer is required' });
    if (!campaignSlug?.trim()) return res.status(400).json({ message: 'Campaign slug is required' });

    // Check if mobile already exists in this campaign
    const existing = await Lead.findOne({ mobile: mobile.trim(), campaignSlug: campaignSlug.trim() });
    if (existing) {
      return res.status(400).json({ message: 'This mobile number is already registered for this campaign.' });
    }

    const lead = await Lead.create({
      name: name.trim(),
      mobile: mobile.trim(),
      answer: answer.trim(),
      campaignSlug: campaignSlug.trim(),
      ref: ref?.trim() || 'direct',
    });

    res.status(201).json({ success: true, id: lead._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (_req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 }).limit(100);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

export default router;
