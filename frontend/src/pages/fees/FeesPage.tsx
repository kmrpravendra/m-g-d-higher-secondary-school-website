import { useState } from 'react';
import { useSearchStudents, useGetFeesByStudent, useRecordFee } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import AppLoadingState from '../../components/AppLoadingState';
import AppErrorState from '../../components/AppErrorState';
import { DollarSign, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function FeesPage() {
  const { data: students, isLoading: loadingStudents } = useSearchStudents();
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const { data: feeRecords, isLoading: loadingFees } = useGetFeesByStudent(selectedStudentId);
  const recordFee = useRecordFee();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    amount: '',
    paymentMode: 'Cash',
    note: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId) {
      toast.error('Please select a student');
      return;
    }

    try {
      await recordFee.mutateAsync({
        studentId: selectedStudentId,
        ...formData,
      });
      toast.success('Fee recorded successfully');
      setFormData({
        date: new Date().toISOString().split('T')[0],
        amount: '',
        paymentMode: 'Cash',
        note: '',
      });
    } catch (error) {
      console.error('Failed to record fee:', error);
      toast.error('Failed to record fee');
    }
  };

  const totalAmount = feeRecords?.reduce((sum, record) => sum + parseFloat(record.amount || '0'), 0) || 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Fee Management</h1>
        <p className="text-muted-foreground">Record and track student fee payments</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Fee Entry Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Record Fee Payment
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
                          {student.name} - {student.mobileNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date *</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMode">Payment Mode *</Label>
                <Select
                  value={formData.paymentMode}
                  onValueChange={(value) => setFormData({ ...formData, paymentMode: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="note">Note (Optional)</Label>
                <Input
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Receipt number, remarks, etc."
                />
              </div>

              <Button type="submit" disabled={recordFee.isPending} className="w-full">
                {recordFee.isPending ? 'Recording...' : 'Record Payment'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Payment History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedStudentId ? (
              <p className="text-center text-muted-foreground py-8">Select a student to view payment history</p>
            ) : loadingFees ? (
              <AppLoadingState message="Loading payment history..." />
            ) : feeRecords && feeRecords.length > 0 ? (
              <>
                <div className="mb-4 p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                  <p className="text-2xl font-bold text-primary">₹{totalAmount.toFixed(2)}</p>
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Mode</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feeRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell className="font-medium">₹{record.amount}</TableCell>
                          <TableCell>{record.paymentMode}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <p className="text-center text-muted-foreground py-8">No payment records found</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
