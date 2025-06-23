import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import bandReducer from './slices/bandSlice';
import eventReducer from './slices/eventSlice';
import attendanceReducer from './slices/attendanceSlice';
import resourceReducer from './slices/resourceSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bands: bandReducer,
    events: eventReducer,
    attendance: attendanceReducer,
    resources: resourceReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these paths in the state
        ignoredActions: ['auth/loginSuccess', 'auth/registerSuccess'],
        ignoredPaths: ['auth.user'],
      },
    }),
});