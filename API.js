import jwt from 'jsonwebtoken';

const SECRET = 'your-secret-key-here'; // Use a strong secret in production

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { username, password } = req.body;
    
    // Check credentials
    if (username === 'Black' && password === 'dhanajis') {
      const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
      return res.status(200).json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Access Denied' });
    }
  } else if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ authenticated: false });
    }
    
    try {
      jwt.verify(token, SECRET);
      return res.status(200).json({ authenticated: true });
    } catch (error) {
      return res.status(401).json({ authenticated: false });
    }
  }
}

