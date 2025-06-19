import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput } from '@fullcalendar/core';
import { Box, Paper, Typography, CircularProgress, useTheme } from '@mui/material';

interface AvailabilityCalendarProps {
  bandId: string;
  pollId?: string;
  isEditable?: boolean;
  onAvailabilityChange?: (selectedTimes: Array<{ start: Date; end: Date; available: boolean }>) => void;
  existingRehearsals?: EventInput[];
  existingAvailability?: Array<{ start: Date; end: Date; available: boolean }>;
  isLoading?: boolean;
}

/**
 * Calendar component for displaying and selecting availability times
 * Can be used in two modes:
 * 1. View mode - to display rehearsals and availability
 * 2. Edit mode - to select and submit availability
 */
const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  bandId,
  pollId,
  isEditable = false,
  onAvailabilityChange,
  existingRehearsals = [],
  existingAvailability = [],
  isLoading = false,
}) => {
  const theme = useTheme();
  const [availabilityEvents, setAvailabilityEvents] = useState<EventInput[]>([]);
  
  // Convert existing availability to calendar events
  useEffect(() => {
    if (existingAvailability && existingAvailability.length > 0) {
      const events = existingAvailability.map((slot) => ({
        start: slot.start,
        end: slot.end,
        title: slot.available ? 'Available' : 'Unavailable',
        backgroundColor: slot.available ? theme.palette.success.main : theme.palette.error.main,
        extendedProps: { availability: slot.available },
      }));
      
      setAvailabilityEvents(events);
    }
  }, [existingAvailability, theme.palette.success.main, theme.palette.error.main]);
  
  // Handle date selection (for editing mode)
  const handleDateSelect = (selectInfo: any) => {
    if (!isEditable) return;
    
    const title = 'Available';
    const calendarApi = selectInfo.view.calendar;
    
    calendarApi.unselect(); // clear selection
    
    const newEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      backgroundColor: theme.palette.success.main,
      extendedProps: { availability: true },
    };
    
    setAvailabilityEvents([...availabilityEvents, newEvent]);
    
    // Notify parent component
    if (onAvailabilityChange) {
      const updatedAvailability = [
        ...availabilityEvents.map((event) => ({
          start: new Date(event.start as string),
          end: new Date(event.end as string),
          available: event.extendedProps?.availability || false,
        })),
        {
          start: new Date(selectInfo.startStr),
          end: new Date(selectInfo.endStr),
          available: true,
        },
      ];
      
      onAvailabilityChange(updatedAvailability);
    }
  };
  
  // Handle event click (toggle availability)
  const handleEventClick = (clickInfo: any) => {
    if (!isEditable) return;
    
    // Toggle availability status
    const currentAvailability = clickInfo.event.extendedProps.availability;
    const newAvailability = !currentAvailability;
    
    // Remove the clicked event
    clickInfo.event.remove();
    
    // Add a new event with toggled availability
    const updatedEvent = {
      id: Math.random().toString(36).substring(2, 9),
      title: newAvailability ? 'Available' : 'Unavailable',
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr,
      backgroundColor: newAvailability ? theme.palette.success.main : theme.palette.error.main,
      extendedProps: { availability: newAvailability },
    };
    
    const updatedEvents = availabilityEvents
      .filter((event) => event.id !== clickInfo.event.id)
      .concat(updatedEvent);
    
    setAvailabilityEvents(updatedEvents);
    
    // Notify parent component
    if (onAvailabilityChange) {
      const updatedAvailability = updatedEvents.map((event) => ({
        start: new Date(event.start as string),
        end: new Date(event.end as string),
        available: event.extendedProps?.availability || false,
      }));
      
      onAvailabilityChange(updatedAvailability);
    }
  };
  
  // Combine rehearsal events and availability events
  const allEvents = [
    ...existingRehearsals.map((rehearsal) => ({
      ...rehearsal,
      backgroundColor: theme.palette.primary.main,
      borderColor: theme.palette.primary.dark,
      editable: false,
    })),
    ...availabilityEvents,
  ];
  
  return (
    <Paper elevation={3} sx={{ p: 2, height: '70vh' }}>
      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>
            {isEditable ? 'Select Your Availability' : 'Band Availability Calendar'}
            {pollId && <Typography variant="caption" display="block">{`Poll ID: ${pollId}`}</Typography>}
          </Typography>
          
          <Box sx={{ height: 'calc(100% - 40px)' }}>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay',
              }}
              editable={false}
              selectable={isEditable}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              events={allEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              height="100%"
              slotMinTime="08:00:00"
              slotMaxTime="23:00:00"
              allDaySlot={false}
            />
          </Box>
        </>
      )}
    </Paper>
  );
};

export default AvailabilityCalendar;