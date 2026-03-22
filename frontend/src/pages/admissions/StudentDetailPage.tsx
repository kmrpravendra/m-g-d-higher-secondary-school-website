import { useNavigate, useParams, Link } from '@tanstack/react-router';
import { useGetStudent, useDeleteStudent } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import AppLoadingState from '../../components/AppLoadingState';
import AppErrorState from '../../components/AppErrorState';
import DeleteStudentDialog from '../../components/admissions/DeleteStudentDialog';
import { ArrowLeft, Edit, Trash2, User } from 'lucide-react';
import { useState } from 'react';

export default function StudentDetailPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const studentId = params.studentId || '';
  const { data: student, isLoading, error } = useGetStudent(studentId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  if (isLoading) {
    return <AppLoadingState message="Loading student details..." />;
  }

  if (error) {
    return <AppErrorState error={error} />;
  }

  if (!student) {
    return <AppErrorState error={new Error('Student not found')} />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/manage/admissions' })}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Student Details</h1>
            <p className="text-muted-foreground">View complete student information</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => navigate({ to: '/manage/admissions/edit/$studentId', params: { studentId } })}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" className="gap-2" onClick={() => setShowDeleteDialog(true)}>
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Photo Card */}
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
              <img
                src={student.photo.getDirectURL()}
                alt={student.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="text-xl font-bold text-center">{student.name}</h2>
            <p className="text-sm text-muted-foreground text-center mt-1">Student ID: {student.id}</p>
          </CardContent>
        </Card>

        {/* Details Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Full Name</p>
                <p className="font-medium">{student.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{student.dateOfBirth}</p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Father's Name</p>
                <p className="font-medium">{student.fatherName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mother's Name</p>
                <p className="font-medium">{student.motherName}</p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Caste</p>
                <p className="font-medium">{student.caste}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mobile Number</p>
                <p className="font-medium">{student.mobileNumber}</p>
              </div>
            </div>

            <Separator />

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                <p className="font-medium">{student.aadhaarNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">PEN Number</p>
                <p className="font-medium">{student.penNumber}</p>
              </div>
            </div>

            <Separator />

            <div>
              <p className="text-sm text-muted-foreground">Address</p>
              <p className="font-medium">{student.address}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteStudentDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        studentId={studentId}
        studentName={student.name}
      />
    </div>
  );
}
