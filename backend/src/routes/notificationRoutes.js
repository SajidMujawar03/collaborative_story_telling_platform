import express from 'express';
import { getNotifications, markAsRead } from '../controllers/notificationController.js';

const router = express.Router();

// Fetch notifications for a user
router.get('/:userId', getNotifications);

// Mark notification as read
router.put('/:notificationId', markAsRead);

export default router;
