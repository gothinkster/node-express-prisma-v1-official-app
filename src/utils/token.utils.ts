import jwt from 'jsonwebtoken';

const generateToken = (payload: string): string =>
  jwt.sign({ email: payload }, process.env.JWT_SECRET || 'superSecret', { expiresIn: '60d' });

export default generateToken;
