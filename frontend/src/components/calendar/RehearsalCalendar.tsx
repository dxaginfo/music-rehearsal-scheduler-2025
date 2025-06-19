import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Box, Typography, useTheme, useMediaQuery, Paper } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatDate, parseISO } from 'date-fns';
import { fetchBandRehearsals } from '../../redux/slices/rehearsalSlice';
import { RootState, AppDispatch } from '../../redux/store';
import { Rehearsal } from '../../types/rehearsal';
import RehearsalDialog from '../rehearsal/RehearsalDialog';
import CreateRehearsalDialog from '../rehearsal/CreateRehearsalDialog';
import NoDataMessage from '../common/NoDataMessage';
import LoadingSpinner from '../common/LoadingSpinner';

interface RehearsalCalendarProps {
  bandId: string;
}

const RehearsalCalendar: React.FC<RehearsalCalendarProps> = ({ bandId }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { rehearsals, loading, error } = useSelector((state: RootState) => state.rehearsals);
  const { currentBand } = useSelector((state: RootState) => state.bands);
  
  const [selectedRehearsal, setSelectedRehearsal] = useState<Rehearsal | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);
  
  useEffect(() => {
    if (bandId) {
      dispatch(fetchBandRehearsals(bandId));
    }
  }, [dispatch, bandId]);
  
  const handleEventClick = (clickInfo: any) => {
    const rehearsal = rehearsals.find(r => r.id === clickInfo.event.id);
    if (rehearsal) {
      setSelectedRehearsal(rehearsal);
      setIsDialogOpen(true);
    }
  };
  
  const handleDateSelect = (selectInfo: any) => {
    setSelectedDates({
      start: selectInfo.start,
      end: selectInfo.end
    });
    setIsCreateDialogOpen(true);
  };
  
  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedRehearsal(null);
  };
  
  const handleCreateDialogClose = () => {
    setIsCreateDialogOpen(false);
    setSelectedDates(null);
  };
  
  const getEventStyle = (rehearsal: any) => {
    const status = rehearsal.extendedProps.status;
    
    // Define colors based on rehearsal status
    switch (status) {
      case 'CANCELLED':
        return { backgroundColor: theme.palette.error.main, borderColor: theme.palette.error.dark, textDecoration: 'line-through' };
      case 'COMPLETED':
        return { backgroundColor: theme.palette.success.main, borderColor: theme.palette.success.dark };
      default:
        return { 
          backgroundColor: theme.palette.primary.main, 
          borderColor: theme.palette.primary.dark 
        };
    }
  };
  
  // Transform rehearsals data for FullCalendar
  const events = rehearsals.map(rehearsal => ({
    id: rehearsal.id,
    title: rehearsal.title,
    start: rehearsal.startTime,
    end: rehearsal.endTime,
    extendedProps: {
      status: rehearsal.status,
      location: rehearsal.location?.name || 'No location',
      attendance: rehearsal.attendance || [],
      isRecurring: rehearsal.isRecurring
    }
  }));
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return (
      <NoDataMessage 
        message="Error loading rehearsals" 
        submessage={error} 
        actionText="Try Again" 
        onAction={() => dispatch(fetchBandRehearsals(bandId))} 
      />
    );
  }
  
  return (
    <Paper sx={{ p: 2, height: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" component="h2">
          {currentBand?.name || 'Band'} Rehearsal Calendar
        </Typography>
      </Box>
      
      <Box sx={{ height: 'calc(100% - 60px)' }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: isMobile ? 'dayGridMonth,timeGridDay' : 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          initialView={isMobile ? 'dayGridMonth' : 'dayGridMonth'}
          editable={false}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={events}
          eventClick={handleEventClick}
          select={handleDateSelect}
          height="100%"
          eventContent={(eventInfo) => {
            return (
              <Box sx={{ 
                p: 0.5, 
                overflow: 'hidden',
                ...(eventInfo.event.extendedProps.status === 'CANCELLED' && { textDecoration: 'line-through' })
              }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', display: 'block', lineHeight: 1.2 }}>
                  {eventInfo.timeText}
                </Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.2 }}>
                  {eventInfo.event.title}
                </Typography>
                {eventInfo.view.type !== 'dayGridMonth' && (
                  <Typography variant="caption" sx={{ display: 'block', lineHeight: 1.2 }}>
                    {eventInfo.event.extendedProps.location}
                  </Typography>
                )}
              </Box>
            );
          }}
          eventDidMount={(info) => {
            const styles = getEventStyle(info.event);
            Object.assign(info.el.style, styles);
          }}
        />
      </Box>
      
      {selectedRehearsal && (
        <RehearsalDialog
          open={isDialogOpen}
          onClose={handleDialogClose}
          rehearsal={selectedRehearsal}
          bandId={bandId}
        />
      )}
      
      {selectedDates && (
        <CreateRehearsalDialog
          open={isCreateDialogOpen}
          onClose={handleCreateDialogClose}
          startTime={selectedDates.start}
          endTime={selectedDates.end}
          bandId={bandId}
        />
      )}
    </Paper>
  );
};

export default RehearsalCalendar;