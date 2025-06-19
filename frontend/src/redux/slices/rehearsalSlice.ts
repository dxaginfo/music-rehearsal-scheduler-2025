import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Rehearsal, CreateRehearsalInput, UpdateRehearsalInput, AttendanceStatus } from '../../types/rehearsal';
import { rehearsalService } from '../../services/rehearsalService';

interface RehearsalState {
  rehearsals: Rehearsal[];
  currentRehearsal: Rehearsal | null;
  loading: boolean;
  error: string | null;
  suggestedTimes: any[] | null;
  loadingSuggestions: boolean;
}

const initialState: RehearsalState = {
  rehearsals: [],
  currentRehearsal: null,
  loading: false,
  error: null,
  suggestedTimes: null,
  loadingSuggestions: false
};

// Async thunks
export const fetchBandRehearsals = createAsyncThunk(
  'rehearsals/fetchBandRehearsals',
  async (bandId: string, { rejectWithValue }) => {
    try {
      const response = await rehearsalService.getBandRehearsals(bandId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsals');
    }
  }
);

export const fetchRehearsalDetails = createAsyncThunk(
  'rehearsals/fetchRehearsalDetails',
  async (rehearsalId: string, { rejectWithValue }) => {
    try {
      const response = await rehearsalService.getRehearsalDetails(rehearsalId);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch rehearsal details');
    }
  }
);

export const createRehearsal = createAsyncThunk(
  'rehearsals/createRehearsal',
  async (rehearsalData: CreateRehearsalInput, { rejectWithValue }) => {
    try {
      const response = await rehearsalService.createRehearsal(rehearsalData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create rehearsal');
    }
  }
);

export const updateRehearsal = createAsyncThunk(
  'rehearsals/updateRehearsal',
  async ({ rehearsalId, data }: { rehearsalId: string; data: UpdateRehearsalInput }, { rejectWithValue }) => {
    try {
      const response = await rehearsalService.updateRehearsal(rehearsalId, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update rehearsal');
    }
  }
);

export const deleteRehearsal = createAsyncThunk(
  'rehearsals/deleteRehearsal',
  async (rehearsalId: string, { rejectWithValue }) => {
    try {
      await rehearsalService.deleteRehearsal(rehearsalId);
      return rehearsalId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete rehearsal');
    }
  }
);

export const updateAttendance = createAsyncThunk(
  'rehearsals/updateAttendance',
  async (
    { rehearsalId, status, notes }: { rehearsalId: string; status: AttendanceStatus; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await rehearsalService.updateAttendance(rehearsalId, status, notes);
      return { rehearsalId, attendance: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update attendance');
    }
  }
);

export const fetchSuggestedTimes = createAsyncThunk(
  'rehearsals/fetchSuggestedTimes',
  async (
    { bandId, startDate, endDate, duration, minAttendees }: 
    { bandId: string; startDate: string; endDate: string; duration?: number; minAttendees?: number },
    { rejectWithValue }
  ) => {
    try {
      const response = await rehearsalService.getSuggestedTimes(bandId, startDate, endDate, duration, minAttendees);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch suggested times');
    }
  }
);

// Slice
const rehearsalSlice = createSlice({
  name: 'rehearsals',
  initialState,
  reducers: {
    clearRehearsalError: (state) => {
      state.error = null;
    },
    clearCurrentRehearsal: (state) => {
      state.currentRehearsal = null;
    },
    clearSuggestedTimes: (state) => {
      state.suggestedTimes = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch band rehearsals
      .addCase(fetchBandRehearsals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBandRehearsals.fulfilled, (state, action: PayloadAction<Rehearsal[]>) => {
        state.loading = false;
        state.rehearsals = action.payload;
      })
      .addCase(fetchBandRehearsals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch rehearsal details
      .addCase(fetchRehearsalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRehearsalDetails.fulfilled, (state, action: PayloadAction<Rehearsal>) => {
        state.loading = false;
        state.currentRehearsal = action.payload;
        
        // Update the rehearsal in the list if it exists
        const index = state.rehearsals.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.rehearsals[index] = action.payload;
        }
      })
      .addCase(fetchRehearsalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create rehearsal
      .addCase(createRehearsal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRehearsal.fulfilled, (state, action: PayloadAction<Rehearsal>) => {
        state.loading = false;
        state.rehearsals.push(action.payload);
        state.currentRehearsal = action.payload;
      })
      .addCase(createRehearsal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update rehearsal
      .addCase(updateRehearsal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRehearsal.fulfilled, (state, action: PayloadAction<Rehearsal>) => {
        state.loading = false;
        
        // Update the rehearsal in the list
        const index = state.rehearsals.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.rehearsals[index] = action.payload;
        }
        
        // Update current rehearsal if it's the same one
        if (state.currentRehearsal?.id === action.payload.id) {
          state.currentRehearsal = action.payload;
        }
      })
      .addCase(updateRehearsal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete rehearsal
      .addCase(deleteRehearsal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRehearsal.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.rehearsals = state.rehearsals.filter(r => r.id !== action.payload);
        
        // Clear current rehearsal if it's the deleted one
        if (state.currentRehearsal?.id === action.payload) {
          state.currentRehearsal = null;
        }
      })
      .addCase(deleteRehearsal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update attendance
      .addCase(updateAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAttendance.fulfilled, (state, action: PayloadAction<{ rehearsalId: string; attendance: any }>) => {
        state.loading = false;
        
        // Find the rehearsal and update its attendance
        const rehearsalIndex = state.rehearsals.findIndex(r => r.id === action.payload.rehearsalId);
        if (rehearsalIndex !== -1) {
          // Update or add the attendance record
          const attendanceIndex = state.rehearsals[rehearsalIndex].attendance?.findIndex(
            a => a.userId === action.payload.attendance.userId
          );
          
          if (attendanceIndex !== -1 && state.rehearsals[rehearsalIndex].attendance) {
            state.rehearsals[rehearsalIndex].attendance[attendanceIndex] = action.payload.attendance;
          } else if (state.rehearsals[rehearsalIndex].attendance) {
            state.rehearsals[rehearsalIndex].attendance.push(action.payload.attendance);
          } else {
            state.rehearsals[rehearsalIndex].attendance = [action.payload.attendance];
          }
        }
        
        // Also update in current rehearsal if it's the same one
        if (state.currentRehearsal?.id === action.payload.rehearsalId) {
          const attendanceIndex = state.currentRehearsal.attendance?.findIndex(
            a => a.userId === action.payload.attendance.userId
          );
          
          if (attendanceIndex !== -1 && state.currentRehearsal.attendance) {
            state.currentRehearsal.attendance[attendanceIndex] = action.payload.attendance;
          } else if (state.currentRehearsal.attendance) {
            state.currentRehearsal.attendance.push(action.payload.attendance);
          } else {
            state.currentRehearsal.attendance = [action.payload.attendance];
          }
        }
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch suggested times
      .addCase(fetchSuggestedTimes.pending, (state) => {
        state.loadingSuggestions = true;
        state.error = null;
      })
      .addCase(fetchSuggestedTimes.fulfilled, (state, action: PayloadAction<any>) => {
        state.loadingSuggestions = false;
        state.suggestedTimes = action.payload.suggestedSlots;
      })
      .addCase(fetchSuggestedTimes.rejected, (state, action) => {
        state.loadingSuggestions = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearRehearsalError, clearCurrentRehearsal, clearSuggestedTimes } = rehearsalSlice.actions;

export default rehearsalSlice.reducer;