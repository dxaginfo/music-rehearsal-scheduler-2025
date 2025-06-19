const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const rehearsalController = require('../controllers/rehearsalController');
const { validate } = require('../middleware/validate');

/**
 * @route GET /api/rehearsals/band/:bandId
 * @desc Get all rehearsals for a band
 * @access Private (band members only)
 */
router.get('/band/:bandId', rehearsalController.getBandRehearsals);

/**
 * @route GET /api/rehearsals/:id
 * @desc Get a specific rehearsal details
 * @access Private (band members only)
 */
router.get('/:id', rehearsalController.getRehearsalDetails);

/**
 * @route POST /api/rehearsals
 * @desc Create a new rehearsal
 * @access Private (band admins only)
 */
router.post(
  '/',
  [
    body('bandId').notEmpty().withMessage('Band ID is required'),
    body('title').notEmpty().withMessage('Title is required'),
    body('startTime').notEmpty().withMessage('Start time is required')
      .isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').notEmpty().withMessage('End time is required')
      .isISO8601().withMessage('End time must be a valid date'),
    validate
  ],
  rehearsalController.createRehearsal
);

/**
 * @route PUT /api/rehearsals/:id
 * @desc Update a rehearsal
 * @access Private (band admins only)
 */
router.put(
  '/:id',
  [
    body('title').optional(),
    body('startTime').optional().isISO8601().withMessage('Start time must be a valid date'),
    body('endTime').optional().isISO8601().withMessage('End time must be a valid date'),
    body('status').optional().isIn(['SCHEDULED', 'CANCELLED', 'COMPLETED']).withMessage('Invalid status'),
    validate
  ],
  rehearsalController.updateRehearsal
);

/**
 * @route DELETE /api/rehearsals/:id
 * @desc Delete a rehearsal
 * @access Private (band admins only)
 */
router.delete('/:id', rehearsalController.deleteRehearsal);

/**
 * @route PUT /api/rehearsals/:rehearsalId/attendance
 * @desc Update attendance status for a rehearsal
 * @access Private (band members only)
 */
router.put(
  '/:rehearsalId/attendance',
  [
    body('status').isIn(['ATTENDING', 'MAYBE', 'NOT_ATTENDING']).withMessage('Invalid attendance status'),
    validate
  ],
  rehearsalController.updateAttendance
);

/**
 * @route GET /api/rehearsals/suggested-times/:bandId
 * @desc Get suggested rehearsal times based on band availability
 * @access Private (band members only)
 */
router.get('/suggested-times/:bandId', rehearsalController.getSuggestedTimes);

module.exports = router;