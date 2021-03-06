import express from 'express';
import jwt from 'jsonwebtoken';
import { currentUser } from '@hitickets/common';

const router = express.Router();

router.get(
  '/api/users/currentuser',
  currentUser,
  //requireAuth,
  (req, res) => {
    try {
      res.send({ currentuser: req.currentUser || null });
    } catch (err) {
      res.send({ currentuser: null });
    }
  }
);

export { router as currentUserRouter };
