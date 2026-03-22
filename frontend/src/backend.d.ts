import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface MonthlyTest {
    id: string;
    marks: string;
    remark?: string;
    month: string;
    studentId: string;
    subject: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface Attendance {
    id: string;
    status: AttendanceStatus;
    studentId: string;
    date: string;
    note?: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface Fee {
    id: string;
    studentId: string;
    date: string;
    note?: string;
    createdAt: bigint;
    updatedAt: bigint;
    paymentMode: string;
    amount: string;
}
export interface Exam {
    id: string;
    marks: string;
    remark?: string;
    studentId: string;
    subject: string;
    createdAt: bigint;
    updatedAt: bigint;
    examDate: string;
    examName: string;
}
export interface UserProfile {
    name: string;
    role: string;
}
export interface Student {
    id: string;
    dateOfBirth: string;
    caste: string;
    name: string;
    createdAt: bigint;
    motherName: string;
    mobileNumber: string;
    updatedAt: bigint;
    penNumber: string;
    fatherName: string;
    address: string;
    aadhaarNumber: string;
    photo: ExternalBlob;
}
export enum AttendanceStatus {
    present = "present",
    absent = "absent"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createStudent(name: string, fatherName: string, motherName: string, dateOfBirth: string, caste: string, mobileNumber: string, aadhaarNumber: string, penNumber: string, photo: ExternalBlob, address: string): Promise<string>;
    deleteStudent(id: string): Promise<void>;
    getAttendanceRecordsByDateRange(startDate: string, endDate: string): Promise<Array<Attendance>>;
    getAttendanceRecordsByStudent(studentId: string): Promise<Array<Attendance>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getExamsByStudent(studentId: string): Promise<Array<Exam>>;
    getFeeRecordsByStudent(studentId: string): Promise<Array<Fee>>;
    getMonthlyTestsByStudent(studentId: string): Promise<Array<MonthlyTest>>;
    getStudent(id: string): Promise<Student>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    recordAttendance(studentId: string, date: string, status: AttendanceStatus, note: string | null): Promise<string>;
    recordExam(studentId: string, examName: string, examDate: string, subject: string, marks: string, remark: string | null): Promise<string>;
    recordFee(studentId: string, date: string, amount: string, paymentMode: string, note: string | null): Promise<string>;
    recordMonthlyTest(studentId: string, month: string, subject: string, marks: string, remark: string | null): Promise<string>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchStudents(nameFilter: string | null, mobileFilter: string | null): Promise<Array<Student>>;
    updateAttendance(id: string, status: AttendanceStatus, note: string | null): Promise<void>;
    updateStudent(id: string, name: string, fatherName: string, motherName: string, dateOfBirth: string, caste: string, mobileNumber: string, aadhaarNumber: string, penNumber: string, photo: ExternalBlob, address: string): Promise<void>;
}
