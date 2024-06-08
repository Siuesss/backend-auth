import prisma from '../utils/prismaClient.js';

export async function requireAdmin(req, res, next) {
  const userId = req.session.userId;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  next();
}

export function checkSessionMiddleware(req, res, next) {
  if (req.session.userId) {
    return res.redirect('/');
  }
  next();
}