import { useState } from 'react';
import { useSearchStudents, useGetExamsByStudent, useRecordExam } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AppLoadingState from '../../components/AppLoadingState';
import { ClipboardList, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function ExamsPage() {
  const { data: students, isLoading: loadingStudents } = useSearchStudents();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const { data: examRecords, isLoading: loadingExams } = useGetExamsByStudent(selectedStudentId);
  const recordExam = useRecordExam();

  const [formData, setFormData] = useState({
    examName: '',
    examDate: new Date().toISOString().split('T')[0],
    subject: '',
    marks: '',
    remark: '',
  });

  const [filterExamName, setFilterExamName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    try {
      await recordExam.mutateAsync({
        studentId: selectedStudentId,
        ...formData,
      });
      toast.success('Exam record added successfully');
      setFormData({
        examName: '',
        examDate: new Date().toISOString().split('T')[0],
        subject: '',
        marks: '',
        remark: '',
      });
    } catch (error) {
      console.error('Failed to record exam:', error);
      toast.error('Failed to record exam');
    }
  };

  const filteredRecords = examRecords?.filter(
    (record) => !filterExamName || record.examName.toLowerCase().includes(filterExamName.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Exam Records</h1>
        <p className="text-muted-foreground">Record and track exam results</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Exam Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Exam Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student">Select Student *</Label>
                {loadingStudents ? (
                  <p className="text-sm text-muted-foreground">Loading students...</p>
                ) : (
                  <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students?.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="examName">Exam Name *</Label>
                  <Input
                    id="examName"
                    value={formData.examName}
                    onChange={(e) => setFormData({ ...formData, examName: e.target.value })}
                    placeholder="e.g., Mid-Term"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="examDate">Exam Date *</Label>
                  <Input
                    id="examDate"
                    type="date"
                    value={formData.examDate}
                    onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g., Science"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks/Grade *</Label>
                  <Input
                    id="marks"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    placeholder="e.g., 92/100 or A+"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="remark">Remark (Optional)</Label>
                <Input
                  id="remark"
                  value={formData.remark}
                  onChange={(e) => setFormData({ ...formData, remark: e.target.value })}
                  placeholder="Additional notes"
                />
              </div>

              <Button type="submit" disabled={recordExam.isPending} className="w-full">
                {recordExam.isPending ? 'Adding...' : 'Add Exam Record'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Exam Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Exam Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStudentId ? (
              <p className="text-center text-muted-foreground py-8">Select a student to view exam records</p>
            ) : loadingExams ? (
              <AppLoadingState message="Loading exam records..." />
            ) : (
              <>
                <div className="mb-4">
                  <Label htmlFor="filterExamName">Filter by Exam Name</Label>
                  <Input
                    id="filterExamName"
                    value={filterExamName}
                    onChange={(e) => setFilterExamName(e.target.value)}
                    placeholder="Search exam name..."
                  />
                </div>
                {filteredRecords && filteredRecords.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exam</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Marks</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.examName}</TableCell>
                            <TableCell>{record.subject}</TableCell>
                            <TableCell>{record.marks}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{record.examDate}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No exam records found</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
