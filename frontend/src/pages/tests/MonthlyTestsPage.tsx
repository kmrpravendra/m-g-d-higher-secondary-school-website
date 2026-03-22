import { useState } from 'react';
import { useSearchStudents, useGetMonthlyTestsByStudent, useRecordMonthlyTest } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AppLoadingState from '../../components/AppLoadingState';
import { FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function MonthlyTestsPage() {
  const { data: students, isLoading: loadingStudents } = useSearchStudents();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const { data: testRecords, isLoading: loadingTests } = useGetMonthlyTestsByStudent(selectedStudentId);
  const recordTest = useRecordMonthlyTest();

  const [formData, setFormData] = useState({
    month: new Date().toISOString().slice(0, 7),
    subject: '',
    marks: '',
    remark: '',
  });

  const [filterMonth, setFilterMonth] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    try {
      await recordTest.mutateAsync({
        studentId: selectedStudentId,
        ...formData,
      });
      toast.success('Test record added successfully');
      setFormData({
        month: new Date().toISOString().slice(0, 7),
        subject: '',
        marks: '',
        remark: '',
      });
    } catch (error) {
      console.error('Failed to record test:', error);
      toast.error('Failed to record test');
    }
  };

  const filteredRecords = testRecords?.filter((record) => !filterMonth || record.month === filterMonth);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Monthly Tests</h1>
        <p className="text-muted-foreground">Record and track monthly test results</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Test Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Test Record
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
                  <Label htmlFor="month">Month *</Label>
                  <Input
                    id="month"
                    type="month"
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marks">Marks *</Label>
                  <Input
                    id="marks"
                    type="text"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                    placeholder="e.g., 85/100"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="e.g., Mathematics"
                  required
                />
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

              <Button type="submit" disabled={recordTest.isPending} className="w-full">
                {recordTest.isPending ? 'Adding...' : 'Add Test Record'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Test Records */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Test Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStudentId ? (
              <p className="text-center text-muted-foreground py-8">Select a student to view test records</p>
            ) : loadingTests ? (
              <AppLoadingState message="Loading test records..." />
            ) : (
              <>
                <div className="mb-4">
                  <Label htmlFor="filterMonth">Filter by Month</Label>
                  <Input
                    id="filterMonth"
                    type="month"
                    value={filterMonth}
                    onChange={(e) => setFilterMonth(e.target.value)}
                    placeholder="All months"
                  />
                </div>
                {filteredRecords && filteredRecords.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Month</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Marks</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell>{record.month}</TableCell>
                            <TableCell>{record.subject}</TableCell>
                            <TableCell className="font-medium">{record.marks}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">No test records found</p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
