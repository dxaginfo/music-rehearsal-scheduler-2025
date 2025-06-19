import { Band } from './band';
import { User } from './user';
import { Location } from './location';

export enum RehearsalStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export enum AttendanceStatus {
  ATTENDING = 'ATTENDING',
  MAYBE = 'MAYBE',
  NOT_ATTENDING = 'NOT_ATTENDING',
  NO_RESPONSE = 'NO_RESPONSE'
}

export interface Attendance {
  rehearsalId: string;
  userId: string;
  status: AttendanceStatus;
  notes?: string;
  responseTime?: string;
  user?: User;
}

export interface RecurringPattern {
  id: string;
  frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  startDate: string;
  endDate?: string;
  timesOfDay?: {
    startTime: string;
    endTime: string;
  }[];
}

export interface Rehearsal {
  id: string;
  bandId: string;
  title: string;
  startTime: string;
  endTime: string;
  locationId?: string;
  notes?: string;
  status: RehearsalStatus;
  isRecurring: boolean;
  recurringPatternId?: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  
  // Populated relationships
  band?: Band;
  location?: Location;
  createdBy?: User;
  attendance?: Attendance[];
  recurringPattern?: RecurringPattern;
}

export interface CreateRehearsalInput {
  bandId: string;
  title: string;
  startTime: string;
  endTime: string;
  locationId?: string;
  notes?: string;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    dayOfWeek?: number;
    dayOfMonth?: number;
    startDate: string;
    endDate?: string;
    timesOfDay?: {
      startTime: string;
      endTime: string;
    }[];
  };
}

export interface UpdateRehearsalInput {
  title?: string;
  startTime?: string;
  endTime?: string;
  locationId?: string;
  notes?: string;
  status?: RehearsalStatus;
  isRecurring?: boolean;
  recurringPattern?: {
    frequency?: 'DAILY' | 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    dayOfWeek?: number;
    dayOfMonth?: number;
    startDate?: string;
    endDate?: string;
    timesOfDay?: {
      startTime: string;
      endTime: string;
    }[];
  };
}

export interface RehearsalFilter {
  startDate?: string;
  endDate?: string;
  status?: RehearsalStatus;
  locationId?: string;
}