import axios from 'axios';
import { Rehearsal, CreateRehearsalInput, UpdateRehearsalInput, AttendanceStatus } from '../types/rehearsal';
import { API_URL } from '../config/constants';

const API_BASE_URL = `${API_URL}/rehearsals`;

// Get all rehearsals for a band
const getBandRehearsals = async (bandId: string): Promise<Rehearsal[]> => {
  const response = await axios.get(`${API_BASE_URL}/band/${bandId}`);
  return response.data;
};

// Get details of a specific rehearsal
const getRehearsalDetails = async (rehearsalId: string): Promise<Rehearsal> => {
  const response = await axios.get(`${API_BASE_URL}/${rehearsalId}`);
  return response.data;
};

// Create a new rehearsal
const createRehearsal = async (rehearsalData: CreateRehearsalInput): Promise<Rehearsal> => {
  const response = await axios.post(API_BASE_URL, rehearsalData);
  return response.data;
};

// Update an existing rehearsal
const updateRehearsal = async (rehearsalId: string, data: UpdateRehearsalInput): Promise<Rehearsal> => {
  const response = await axios.put(`${API_BASE_URL}/${rehearsalId}`, data);
  return response.data;
};

// Delete a rehearsal
const deleteRehearsal = async (rehearsalId: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${rehearsalId}`);
};

// Update attendance status for a rehearsal
const updateAttendance = async (rehearsalId: string, status: AttendanceStatus, notes?: string): Promise<any> => {
  const response = await axios.put(`${API_BASE_URL}/${rehearsalId}/attendance`, { status, notes });
  return response.data;
};

// Get suggested rehearsal times based on member availability
const getSuggestedTimes = async (
  bandId: string,
  startDate: string,
  endDate: string,
  duration?: number,
  minAttendees?: number
): Promise<any> => {
  const params: any = {
    startDate,
    endDate
  };
  
  if (duration) params.duration = duration;
  if (minAttendees) params.minAttendees = minAttendees;
  
  const response = await axios.get(`${API_BASE_URL}/suggested-times/${bandId}`, { params });
  return response.data;
};

export const rehearsalService = {
  getBandRehearsals,
  getRehearsalDetails,
  createRehearsal,
  updateRehearsal,
  deleteRehearsal,
  updateAttendance,
  getSuggestedTimes
};