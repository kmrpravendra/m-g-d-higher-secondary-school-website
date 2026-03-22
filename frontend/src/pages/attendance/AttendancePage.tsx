import { useState, useMemo } from 'react';
import { useSearchStudents, useGetAttendanceByDateRange, useRecordAttendance, useUpdateAttendance } from '../../hooks/useQueries';
import { AttendanceStatus } from '../../backend';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import AppLoadingState from '../../components/AppLoadingState';
import AppErrorState from '../../components/AppErrorState';
import { Calendar, Check, X, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { data: students, isLoading: loadingStudents } = useSearchStudents();
  const { data: attendanceRecords, isLoading: loadingAttendance } = useGetAttendanceByDateRange(
    selectedDate,
    selectedDate
  );
  const recordAttendance = useRecordAttendance();
  const updateAttendance = useUpdateAttendance();

  const [attendanceData, setAttendanceData] = useState<
    Record<string, { status: AttendanceStatus; note: string }>
  >({});

  // Sync attendance data when records load
  useMemo(() => {
    if (attendanceRecords) {
      const data: Record<string, { status: AttendanceStatus; note: string }> = {};
      attendanceRecords.forEach((record) => {
        data[record.studentId] = {
          status: record.status,
          note: record.note || '',
        };
      });
      setAttendanceData(data);
    }
  }, [attendanceRecords]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        status,
        note: prev[studentId]?.note || '',
      },
    }));
  };

  const handleNoteChange = (studentId: string, note: string) => {
    setAttendanceData((prev) => ({
      ...prev,
      [studentId]: {
        status: prev[studentId]?.status || AttendanceStatus.present,
        note,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const promises = Object.entries(attendanceData).map(([studentId, data]) => {
        const existingRecord = attendanceRecords?.find((r) => r.studentId === studentId);
        if (existingRecord) {
          return updateAttendance.mutateAsync({
            id: existingRecord.id,
            status: data.status,
            note: data.note,
          });
        } else {
          return recordAttendance.mutateAsync({
            studentId,
            date: selectedDate,
            status: data.status,
            note: data.note,
          });
        }
      });

      await Promise.all(promises);
      toast.success('Attendance saved successfully');
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast.error('Failed to save attendance');
    }
  };

  const isSaving = recordAttendance.isPending || updateAttendance.isPending;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <p className="text-muted-foreground">Mark and track student attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Select Date
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={handleSave} disabled={isSaving} className="gap-2">
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {loadingStudents || loadingAttendance ? (
        <AppLoadingState message="Loading attendance data..." />
      ) : (
        <div className="space-y-4">
          {students && students.length > 0 ? (
            students.map((student) => {
              const data = attendanceData[student.id] || {
                status: AttendanceStatus.present,
                note: '',
              };
              return (
                <Card key={student.id}>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">Mobile: {student.mobileNumber}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={data.status === AttendanceStatus.present ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, AttendanceStatus.present)}
                          className="gap-2"
                        >
                          <Check className="h-4 w-4" />
                          Present
                        </Button>
                        <Button
                          variant={data.status === AttendanceStatus.absent ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(student.id, AttendanceStatus.absent)}
                          className="gap-2"
                        >
                          <X className="h-4 w-4" />
                          Absent
                        </Button>
                      </div>
                      <Input
                        placeholder="Note (optional)"
                        value={data.note}
                        onChange={(e) => handleNoteChange(student.id, e.target.value)}
                        className="md:max-w-xs"
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No students found. Add students first.</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
