const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Controller for handling rehearsal-related operations
 */
const rehearsalController = {
  /**
   * Get all rehearsals for a band
   */
  getBandRehearsals: async (req, res) => {
    try {
      const { bandId } = req.params;
      const { start, end, status } = req.query;
      
      // Verify user is a member of the band
      const bandMember = await prisma.bandMember.findFirst({
        where: {
          bandId,
          userId: req.user.id,
        },
      });
      
      if (!bandMember) {
        return res.status(403).json({ message: 'You are not a member of this band' });
      }
      
      // Build filter conditions
      const whereConditions = { bandId };
      
      if (start && end) {
        whereConditions.startTime = {
          gte: new Date(start),
        };
        whereConditions.endTime = {
          lte: new Date(end),
        };
      }
      
      if (status) {
        whereConditions.status = status;
      }
      
      const rehearsals = await prisma.rehearsal.findMany({
        where: whereConditions,
        include: {
          location: true,
          band: {
            select: {
              name: true,
            },
          },
          attendance: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
        },
        orderBy: {
          startTime: 'asc',
        },
      });
      
      res.json(rehearsals);
    } catch (error) {
      console.error('Error getting band rehearsals:', error);
      res.status(500).json({ message: 'Failed to get rehearsals', error: error.message });
    }
  },
  
  /**
   * Create a new rehearsal
   */
  createRehearsal: async (req, res) => {
    try {
      const { bandId, title, startTime, endTime, locationId, notes, isRecurring, recurringPattern } = req.body;
      
      // Verify user is an admin of the band
      const bandMember = await prisma.bandMember.findFirst({
        where: {
          bandId,
          userId: req.user.id,
          role: 'ADMIN',
        },
      });
      
      if (!bandMember) {
        return res.status(403).json({ message: 'Only band admins can create rehearsals' });
      }
      
      // Start a transaction to handle possible recurring pattern
      const result = await prisma.$transaction(async (tx) => {
        let recurringPatternId = null;
        
        // If it's a recurring rehearsal, create the pattern first
        if (isRecurring && recurringPattern) {
          const createdPattern = await tx.recurringPattern.create({
            data: {
              frequency: recurringPattern.frequency,
              dayOfWeek: recurringPattern.dayOfWeek,
              dayOfMonth: recurringPattern.dayOfMonth,
              startDate: new Date(recurringPattern.startDate),
              endDate: recurringPattern.endDate ? new Date(recurringPattern.endDate) : null,
              timesOfDay: recurringPattern.timesOfDay,
            },
          });
          
          recurringPatternId = createdPattern.id;
        }
        
        // Create the rehearsal
        const rehearsal = await tx.rehearsal.create({
          data: {
            bandId,
            title,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            locationId: locationId || null,
            notes: notes || null,
            createdById: req.user.id,
            status: 'SCHEDULED',
            isRecurring: isRecurring || false,
            recurringPatternId,
          },
          include: {
            location: true,
            band: {
              select: {
                name: true,
              },
            },
          },
        });
        
        // Create attendance records for all band members
        const bandMembers = await tx.bandMember.findMany({
          where: {
            bandId,
            status: 'ACTIVE',
          },
          select: {
            userId: true,
          },
        });
        
        await tx.attendance.createMany({
          data: bandMembers.map(member => ({
            rehearsalId: rehearsal.id,
            userId: member.userId,
            status: 'NO_RESPONSE',
          })),
        });
        
        // Create notifications for band members
        await tx.notification.createMany({
          data: bandMembers.map(member => ({
            userId: member.userId,
            type: 'REHEARSAL_SCHEDULED',
            content: JSON.stringify({
              rehearsalId: rehearsal.id,
              title: rehearsal.title,
              startTime: rehearsal.startTime,
              endTime: rehearsal.endTime,
            }),
            relatedEntityId: rehearsal.id,
          })),
        });
        
        return rehearsal;
      });
      
      res.status(201).json(result);
    } catch (error) {
      console.error('Error creating rehearsal:', error);
      res.status(500).json({ message: 'Failed to create rehearsal', error: error.message });
    }
  },
  
  /**
   * Update an existing rehearsal
   */
  updateRehearsal: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, startTime, endTime, locationId, notes, status } = req.body;
      
      // Get the rehearsal to check permissions
      const existingRehearsal = await prisma.rehearsal.findUnique({
        where: { id },
        include: {
          band: {
            include: {
              members: {
                where: {
                  userId: req.user.id,
                  role: 'ADMIN',
                },
              },
            },
          },
        },
      });
      
      if (!existingRehearsal) {
        return res.status(404).json({ message: 'Rehearsal not found' });
      }
      
      // Check if user is band admin
      if (existingRehearsal.band.members.length === 0) {
        return res.status(403).json({ message: 'Only band admins can update rehearsals' });
      }
      
      // Update the rehearsal
      const updatedRehearsal = await prisma.rehearsal.update({
        where: { id },
        data: {
          title: title || undefined,
          startTime: startTime ? new Date(startTime) : undefined,
          endTime: endTime ? new Date(endTime) : undefined,
          locationId: locationId !== undefined ? locationId : undefined,
          notes: notes !== undefined ? notes : undefined,
          status: status || undefined,
          updatedAt: new Date(),
        },
        include: {
          location: true,
          band: {
            select: {
              name: true,
            },
          },
        },
      });
      
      // If the status has changed to CANCELLED, update all notifications
      if (status === 'CANCELLED' && existingRehearsal.status !== 'CANCELLED') {
        await prisma.notification.createMany({
          data: (await prisma.bandMember.findMany({
            where: {
              bandId: existingRehearsal.bandId,
              status: 'ACTIVE',
            },
            select: {
              userId: true,
            },
          })).map(member => ({
            userId: member.userId,
            type: 'REHEARSAL_CANCELLED',
            content: JSON.stringify({
              rehearsalId: updatedRehearsal.id,
              title: updatedRehearsal.title,
              startTime: updatedRehearsal.startTime,
              endTime: updatedRehearsal.endTime,
            }),
            relatedEntityId: updatedRehearsal.id,
          })),
        });
      }
      // If the schedule has changed, notify all members
      else if ((startTime || endTime) && status !== 'CANCELLED') {
        await prisma.notification.createMany({
          data: (await prisma.bandMember.findMany({
            where: {
              bandId: existingRehearsal.bandId,
              status: 'ACTIVE',
            },
            select: {
              userId: true,
            },
          })).map(member => ({
            userId: member.userId,
            type: 'REHEARSAL_CHANGED',
            content: JSON.stringify({
              rehearsalId: updatedRehearsal.id,
              title: updatedRehearsal.title,
              startTime: updatedRehearsal.startTime,
              endTime: updatedRehearsal.endTime,
            }),
            relatedEntityId: updatedRehearsal.id,
          })),
        });
      }
      
      res.json(updatedRehearsal);
    } catch (error) {
      console.error('Error updating rehearsal:', error);
      res.status(500).json({ message: 'Failed to update rehearsal', error: error.message });
    }
  },
  
  /**
   * Delete a rehearsal
   */
  deleteRehearsal: async (req, res) => {
    try {
      const { id } = req.params;
      
      // Get the rehearsal to check permissions
      const existingRehearsal = await prisma.rehearsal.findUnique({
        where: { id },
        include: {
          band: {
            include: {
              members: {
                where: {
                  userId: req.user.id,
                  role: 'ADMIN',
                },
              },
            },
          },
        },
      });
      
      if (!existingRehearsal) {
        return res.status(404).json({ message: 'Rehearsal not found' });
      }
      
      // Check if user is band admin
      if (existingRehearsal.band.members.length === 0) {
        return res.status(403).json({ message: 'Only band admins can delete rehearsals' });
      }
      
      // Delete related records first
      await prisma.$transaction([
        prisma.attendance.deleteMany({
          where: { rehearsalId: id },
        }),
        prisma.notification.deleteMany({
          where: { relatedEntityId: id },
        }),
        prisma.rehearsalNote.deleteMany({
          where: { rehearsalId: id },
        }),
        prisma.rehearsal.delete({
          where: { id },
        }),
      ]);
      
      res.json({ message: 'Rehearsal deleted successfully' });
    } catch (error) {
      console.error('Error deleting rehearsal:', error);
      res.status(500).json({ message: 'Failed to delete rehearsal', error: error.message });
    }
  },
  
  /**
   * Get details for a single rehearsal
   */
  getRehearsalDetails: async (req, res) => {
    try {
      const { id } = req.params;
      
      const rehearsal = await prisma.rehearsal.findUnique({
        where: { id },
        include: {
          location: true,
          band: {
            select: {
              id: true,
              name: true,
              members: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          attendance: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          },
          rehearsalNotes: {
            include: {
              createdBy: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
          recurringPattern: true,
        },
      });
      
      if (!rehearsal) {
        return res.status(404).json({ message: 'Rehearsal not found' });
      }
      
      // Check if the user is a member of the band
      const isMember = await prisma.bandMember.findFirst({
        where: {
          bandId: rehearsal.band.id,
          userId: req.user.id,
        },
      });
      
      if (!isMember) {
        return res.status(403).json({ message: 'You are not a member of this band' });
      }
      
      res.json(rehearsal);
    } catch (error) {
      console.error('Error getting rehearsal details:', error);
      res.status(500).json({ message: 'Failed to get rehearsal details', error: error.message });
    }
  },
  
  /**
   * Update attendance status for a rehearsal
   */
  updateAttendance: async (req, res) => {
    try {
      const { rehearsalId } = req.params;
      const { status, notes } = req.body;
      
      // Check if the rehearsal exists
      const rehearsal = await prisma.rehearsal.findUnique({
        where: { id: rehearsalId },
      });
      
      if (!rehearsal) {
        return res.status(404).json({ message: 'Rehearsal not found' });
      }
      
      // Check if the user is a member of the band
      const isMember = await prisma.bandMember.findFirst({
        where: {
          bandId: rehearsal.bandId,
          userId: req.user.id,
        },
      });
      
      if (!isMember) {
        return res.status(403).json({ message: 'You are not a member of this band' });
      }
      
      // Update or create attendance record
      const attendance = await prisma.attendance.upsert({
        where: {
          rehearsalId_userId: {
            rehearsalId,
            userId: req.user.id,
          },
        },
        update: {
          status,
          notes: notes || null,
          responseTime: new Date(),
        },
        create: {
          rehearsalId,
          userId: req.user.id,
          status,
          notes: notes || null,
          responseTime: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });
      
      res.json(attendance);
    } catch (error) {
      console.error('Error updating attendance:', error);
      res.status(500).json({ message: 'Failed to update attendance', error: error.message });
    }
  },
  
  /**
   * Get suggested rehearsal times based on band member availability
   */
  getSuggestedTimes: async (req, res) => {
    try {
      const { bandId } = req.params;
      const { startDate, endDate, duration, minAttendees } = req.query;
      
      // Verify user is a member of the band
      const bandMember = await prisma.bandMember.findFirst({
        where: {
          bandId,
          userId: req.user.id,
        },
      });
      
      if (!bandMember) {
        return res.status(403).json({ message: 'You are not a member of this band' });
      }
      
      // Get all active polls for the date range
      const polls = await prisma.availabilityPoll.findMany({
        where: {
          bandId,
          status: 'OPEN',
          pollOptions: {
            some: {
              startTime: {
                gte: new Date(startDate),
              },
              endTime: {
                lte: new Date(endDate),
              },
            },
          },
        },
        include: {
          pollOptions: {
            include: {
              responses: {
                include: {
                  user: {
                    select: {
                      id: true,
                      firstName: true,
                      lastName: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      
      // Get active band members
      const members = await prisma.bandMember.findMany({
        where: {
          bandId,
          status: 'ACTIVE',
        },
        select: {
          userId: true,
        },
      });
      
      const memberIds = members.map(m => m.userId);
      const minAttendeesCount = minAttendees ? parseInt(minAttendees) : Math.ceil(memberIds.length / 2);
      const rehearsalDuration = duration ? parseInt(duration) : 120; // default 2 hours in minutes
      
      // Process all poll options to find time slots with the most availability
      const timeSlots = [];
      
      for (const poll of polls) {
        for (const option of poll.pollOptions) {
          const availableResponses = option.responses.filter(r => 
            r.availability === 'AVAILABLE' && memberIds.includes(r.userId)
          );
          
          const maybeResponses = option.responses.filter(r => 
            r.availability === 'MAYBE' && memberIds.includes(r.userId)
          );
          
          const slotDuration = (option.endTime - option.startTime) / (1000 * 60); // in minutes
          
          // Only consider slots that are long enough for the rehearsal
          if (slotDuration >= rehearsalDuration) {
            timeSlots.push({
              startTime: option.startTime,
              endTime: option.endTime,
              availableCount: availableResponses.length,
              maybeCount: maybeResponses.length,
              totalCount: memberIds.length,
              availableMembers: availableResponses.map(r => ({
                id: r.user.id,
                name: `${r.user.firstName} ${r.user.lastName}`,
              })),
              pollId: poll.id,
            });
          }
        }
      }
      
      // Sort time slots by availability (best options first)
      const suggestedSlots = timeSlots
        .filter(slot => slot.availableCount >= minAttendeesCount)
        .sort((a, b) => {
          // Primary sort by available count (descending)
          if (b.availableCount !== a.availableCount) {
            return b.availableCount - a.availableCount;
          }
          // Secondary sort by maybe count (descending)
          if (b.maybeCount !== a.maybeCount) {
            return b.maybeCount - a.maybeCount;
          }
          // Tertiary sort by start time (ascending)
          return a.startTime - b.startTime;
        })
        .slice(0, 10); // Return top 10 suggestions
      
      res.json({
        suggestedSlots,
        totalMembers: memberIds.length,
        minAttendees: minAttendeesCount,
        requestedDuration: rehearsalDuration,
      });
    } catch (error) {
      console.error('Error getting suggested times:', error);
      res.status(500).json({ message: 'Failed to get suggested times', error: error.message });
    }
  },
};

module.exports = rehearsalController;