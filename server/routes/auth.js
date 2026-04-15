import express from 'express';

const router = express.Router();

router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (password === adminPass) {
    // In a real app, we'd use JWT. For this starter, a simple success flag works.
    res.json({ success: true, token: 'authenticated-session-token' });
  } else {
    res.status(401).json({ message: 'Invalid admin password' });
  }
});

export default router;
