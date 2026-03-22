import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Student, Attendance, Fee, MonthlyTest, Exam, AttendanceStatus, UserProfile } from '../backend';
import { ExternalBlob } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Student Queries
export function useSearchStudents(nameFilter?: string, mobileFilter?: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Student[]>({
    queryKey: ['students', nameFilter, mobileFilter],
    queryFn: async () => {
      if (!actor) return [];
      return actor.searchStudents(nameFilter || null, mobileFilter || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetStudent(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Student>({
    queryKey: ['student', id],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStudent(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      name: string;
      fatherName: string;
      motherName: string;
      dateOfBirth: string;
      caste: string;
      mobileNumber: string;
      aadhaarNumber: string;
      penNumber: string;
      photo: ExternalBlob;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createStudent(
        data.name,
        data.fatherName,
        data.motherName,
        data.dateOfBirth,
        data.caste,
        data.mobileNumber,
        data.aadhaarNumber,
        data.penNumber,
        data.photo,
        data.address
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

export function useUpdateStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      id: string;
      name: string;
      fatherName: string;
      motherName: string;
      dateOfBirth: string;
      caste: string;
      mobileNumber: string;
      aadhaarNumber: string;
      penNumber: string;
      photo: ExternalBlob;
      address: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateStudent(
        data.id,
        data.name,
        data.fatherName,
        data.motherName,
        data.dateOfBirth,
        data.caste,
        data.mobileNumber,
        data.aadhaarNumber,
        data.penNumber,
        data.photo,
        data.address
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['student', variables.id] });
    },
  });
}

export function useDeleteStudent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteStudent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
  });
}

// Attendance Queries
export function useGetAttendanceByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Attendance[]>({
    queryKey: ['attendance', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendanceRecordsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useGetAttendanceByDateRange(startDate: string, endDate: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Attendance[]>({
    queryKey: ['attendance', 'dateRange', startDate, endDate],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAttendanceRecordsByDateRange(startDate, endDate);
    },
    enabled: !!actor && !isFetching && !!startDate && !!endDate,
  });
}

export function useRecordAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      date: string;
      status: AttendanceStatus;
      note?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordAttendance(data.studentId, data.date, data.status, data.note || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useUpdateAttendance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: { id: string; status: AttendanceStatus; note?: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateAttendance(data.id, data.status, data.note || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

// Fee Queries
export function useGetFeesByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Fee[]>({
    queryKey: ['fees', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFeeRecordsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useRecordFee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      date: string;
      amount: string;
      paymentMode: string;
      note?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordFee(data.studentId, data.date, data.amount, data.paymentMode, data.note || null);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
    },
  });
}

// Monthly Test Queries
export function useGetMonthlyTestsByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<MonthlyTest[]>({
    queryKey: ['monthlyTests', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMonthlyTestsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useRecordMonthlyTest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      month: string;
      subject: string;
      marks: string;
      remark?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordMonthlyTest(
        data.studentId,
        data.month,
        data.subject,
        data.marks,
        data.remark || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyTests'] });
    },
  });
}

// Exam Queries
export function useGetExamsByStudent(studentId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Exam[]>({
    queryKey: ['exams', 'student', studentId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getExamsByStudent(studentId);
    },
    enabled: !!actor && !isFetching && !!studentId,
  });
}

export function useRecordExam() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      studentId: string;
      examName: string;
      examDate: string;
      subject: string;
      marks: string;
      remark?: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordExam(
        data.studentId,
        data.examName,
        data.examDate,
        data.subject,
        data.marks,
        data.remark || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exams'] });
    },
  });
}
