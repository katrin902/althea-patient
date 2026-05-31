import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type ReferralStatus = 'none' | 'uploading' | 'uploaded';
export type CurrentStatus =
  | 'not_started'
  | 'intake_completed'
  | 'provider_selected'
  | 'institution_intake_done'
  | 'waiting'
  | 'appointment_scheduled';

export interface CheckIn {
  id: string;
  date: string;
  mood: number;
  anxiety: number;
  stress: number;
  sleep: number;
  note: string;
  unsafeFlag: boolean;
}

export interface HomeworkTask {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  type: 'exercise' | 'reading' | 'reflection' | 'activity';
}

export interface Reminder {
  id: string;
  type: 'appointment' | 'check-in' | 'homework' | 'intake';
  title: string;
  message: string;
  actionLabel: string;
  actionRoute: string;
  dismissed: boolean;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  provider: string;
  therapist: string;
  type: string;
  location: string;
  status: 'confirmed' | 'pending' | 'completed';
  notes?: string;
}

export interface ProviderRequest {
  providerId: string;
  providerName: string;
  status: 'pending' | 'accepted' | 'rejected';
  requestedAt: string;
  acceptedAt?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  patientName: string;
  patientAge: number | null;
  patientCity: string;
  patientInsurance: string;
  patientLanguage: string;
  currentSituation: string;
  referralStatus: ReferralStatus;
  providerRequests: ProviderRequest[];
  currentStatus: CurrentStatus;
  intakeCompleted: boolean;
  intakeSummaryApproved: boolean;
  crisisConsentGiven: boolean;
  intakeMessages: { role: 'user' | 'assistant'; content: string }[];
  checkInHistory: CheckIn[];
  homeworkTasks: HomeworkTask[];
  reminders: Reminder[];
  appointments: Appointment[];
}

type Action =
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_PATIENT_NAME'; payload: string }
  | { type: 'SET_PATIENT_AGE'; payload: number }
  | { type: 'SET_PATIENT_CITY'; payload: string }
  | { type: 'SET_PATIENT_INSURANCE'; payload: string }
  | { type: 'SET_PATIENT_LANGUAGE'; payload: string }
  | { type: 'SET_CURRENT_SITUATION'; payload: string }
  | { type: 'SET_REFERRAL_STATUS'; payload: ReferralStatus }
  | { type: 'ADD_PROVIDER_REQUEST'; payload: ProviderRequest }
  | { type: 'UPDATE_PROVIDER_REQUEST_STATUS'; payload: { providerId: string; status: ProviderRequest['status']; acceptedAt?: string } }
  | { type: 'REMOVE_PROVIDER_REQUEST'; payload: string }
  | { type: 'SET_CURRENT_STATUS'; payload: CurrentStatus }
  | { type: 'SET_INTAKE_COMPLETED'; payload: boolean }
  | { type: 'SET_INTAKE_SUMMARY_APPROVED'; payload: boolean }
  | { type: 'SET_CRISIS_CONSENT'; payload: boolean }
  | { type: 'ADD_INTAKE_MESSAGE'; payload: { role: 'user' | 'assistant'; content: string } }
  | { type: 'ADD_CHECK_IN'; payload: CheckIn }
  | { type: 'COMPLETE_HOMEWORK'; payload: string }
  | { type: 'DISMISS_REMINDER'; payload: string }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'UPDATE_APPOINTMENT_STATUS'; payload: { id: string; status: Appointment['status'] } };

const initialState: AppState = {
  isAuthenticated: false,
  patientName: 'Sophie',
  patientAge: 22,
  patientCity: 'Amsterdam',
  patientInsurance: 'CZ',
  patientLanguage: 'English',
  currentSituation:
    "I've been experiencing a lot of anxiety and stress, mainly around university. I find it hard to concentrate and I'm not sleeping well.",
  referralStatus: 'uploaded',
  providerRequests: [
    {
      providerId: 'p1',
      providerName: 'Amsterdam Mental Health Center',
      status: 'accepted',
      requestedAt: '2025-06-01',
      acceptedAt: '2025-06-03',
    },
    {
      providerId: 'p2',
      providerName: 'GGZ Noord-Holland',
      status: 'pending',
      requestedAt: '2025-06-10',
    },
  ],
  currentStatus: 'waiting',
  intakeCompleted: true,
  intakeSummaryApproved: true,
  crisisConsentGiven: true,
  intakeMessages: [],
  checkInHistory: [
    { id: 'c1', date: '2025-06-06', mood: 5, anxiety: 7, stress: 6, sleep: 4, note: 'Difficult week with exams', unsafeFlag: false },
    { id: 'c2', date: '2025-06-07', mood: 6, anxiety: 6, stress: 5, sleep: 5, note: 'Slightly better today', unsafeFlag: false },
    { id: 'c3', date: '2025-06-08', mood: 4, anxiety: 8, stress: 7, sleep: 3, note: 'Hard to sleep', unsafeFlag: false },
    { id: 'c4', date: '2025-06-09', mood: 6, anxiety: 6, stress: 5, sleep: 6, note: 'A bit more relaxed', unsafeFlag: false },
    { id: 'c5', date: '2025-06-10', mood: 7, anxiety: 5, stress: 4, sleep: 6, note: 'Good day overall', unsafeFlag: false },
    { id: 'c6', date: '2025-06-11', mood: 7, anxiety: 5, stress: 5, sleep: 7, note: 'Studied and felt focused', unsafeFlag: false },
  ],
  homeworkTasks: [
    {
      id: 'hw1',
      title: 'Mood journal',
      description: 'Write 5 minutes about your day and how you felt. Focus on what went well.',
      dueDate: '2025-06-13',
      completed: false,
      type: 'reflection',
    },
    {
      id: 'hw2',
      title: '5-minute box breathing',
      description: 'Practice box breathing (4-4-4-4) once today. Use the guide in Resources.',
      dueDate: '2025-06-13',
      completed: true,
      type: 'exercise',
    },
    {
      id: 'hw3',
      title: 'Read: Understanding anxiety',
      description: 'Read pages 12–18 of the CBT workbook your provider sent.',
      dueDate: '2025-06-14',
      completed: false,
      type: 'reading',
    },
  ],
  reminders: [
    {
      id: 'r1',
      type: 'check-in',
      title: "Today's check-in",
      message: "You haven't checked in yet today.",
      actionLabel: 'Check in now',
      actionRoute: '/(tabs)/check-in',
      dismissed: false,
    },
    {
      id: 'r2',
      type: 'appointment',
      title: 'First session in 12 days',
      message: 'Dr. Lisa van Berg · June 24 · 14:00',
      actionLabel: 'View details',
      actionRoute: '/(tabs)/appointments',
      dismissed: false,
    },
    {
      id: 'r3',
      type: 'homework',
      title: 'Homework due tomorrow',
      message: 'Mood journal — 5 min reflection.',
      actionLabel: 'View tasks',
      actionRoute: '/(tabs)/check-in',
      dismissed: false,
    },
  ],
  appointments: [
    {
      id: 'appt1',
      date: 'Tuesday, June 24',
      time: '14:00',
      provider: 'Amsterdam Mental Health Center',
      therapist: 'Dr. Lisa van Berg',
      type: 'Intake appointment',
      location: 'Herengracht 182, Amsterdam · Room 3',
      status: 'confirmed',
      notes: 'Please arrive 10 minutes early and bring your GP referral letter.',
    },
  ],
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_PATIENT_NAME':
      return { ...state, patientName: action.payload };
    case 'SET_PATIENT_AGE':
      return { ...state, patientAge: action.payload };
    case 'SET_PATIENT_CITY':
      return { ...state, patientCity: action.payload };
    case 'SET_PATIENT_INSURANCE':
      return { ...state, patientInsurance: action.payload };
    case 'SET_PATIENT_LANGUAGE':
      return { ...state, patientLanguage: action.payload };
    case 'SET_CURRENT_SITUATION':
      return { ...state, currentSituation: action.payload };
    case 'SET_REFERRAL_STATUS':
      return { ...state, referralStatus: action.payload };
    case 'ADD_PROVIDER_REQUEST':
      if (state.providerRequests.some((r) => r.providerId === action.payload.providerId)) {
        return state;
      }
      return { ...state, providerRequests: [...state.providerRequests, action.payload] };
    case 'UPDATE_PROVIDER_REQUEST_STATUS':
      return {
        ...state,
        providerRequests: state.providerRequests.map((r) =>
          r.providerId === action.payload.providerId
            ? {
                ...r,
                status: action.payload.status,
                ...(action.payload.acceptedAt ? { acceptedAt: action.payload.acceptedAt } : {}),
              }
            : r
        ),
      };
    case 'REMOVE_PROVIDER_REQUEST':
      return {
        ...state,
        providerRequests: state.providerRequests.filter((r) => r.providerId !== action.payload),
      };
    case 'SET_CURRENT_STATUS':
      return { ...state, currentStatus: action.payload };
    case 'SET_INTAKE_COMPLETED':
      return { ...state, intakeCompleted: action.payload };
    case 'SET_INTAKE_SUMMARY_APPROVED':
      return { ...state, intakeSummaryApproved: action.payload };
    case 'SET_CRISIS_CONSENT':
      return { ...state, crisisConsentGiven: action.payload };
    case 'ADD_INTAKE_MESSAGE':
      return { ...state, intakeMessages: [...state.intakeMessages, action.payload] };
    case 'ADD_CHECK_IN':
      return { ...state, checkInHistory: [...state.checkInHistory, action.payload] };
    case 'COMPLETE_HOMEWORK':
      return {
        ...state,
        homeworkTasks: state.homeworkTasks.map((t) =>
          t.id === action.payload ? { ...t, completed: true } : t
        ),
      };
    case 'DISMISS_REMINDER':
      return {
        ...state,
        reminders: state.reminders.map((r) =>
          r.id === action.payload ? { ...r, dismissed: true } : r
        ),
      };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'UPDATE_APPOINTMENT_STATUS':
      return {
        ...state,
        appointments: state.appointments.map((a) =>
          a.id === action.payload.id ? { ...a, status: action.payload.status } : a
        ),
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
