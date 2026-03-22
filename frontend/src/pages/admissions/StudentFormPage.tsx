import { useState, useEffect } from 'react';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useGetStudent, useCreateStudent, useUpdateStudent } from '../../hooks/useQueries';
import { ExternalBlob } from '../../backend';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import AppLoadingState from '../../components/AppLoadingState';
import AppErrorState from '../../components/AppErrorState';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StudentFormPage() {
  const navigate = useNavigate();
  const params = useParams({ strict: false });
  const studentId = params.studentId;
  const isEditMode = !!studentId;

  const { data: existingStudent, isLoading: loadingStudent, error: loadError } = useGetStudent(studentId || '');
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();

  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    caste: '',
    mobileNumber: '',
    aadhaarNumber: '',
    penNumber: '',
    address: '',
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (existingStudent) {
      setFormData({
        name: existingStudent.name,
        fatherName: existingStudent.fatherName,
        motherName: existingStudent.motherName,
        dateOfBirth: existingStudent.dateOfBirth,
        caste: existingStudent.caste,
        mobileNumber: existingStudent.mobileNumber,
        aadhaarNumber: existingStudent.aadhaarNumber,
        penNumber: existingStudent.penNumber,
        address: existingStudent.address,
      });
      setPhotoPreview(existingStudent.photo.getDirectURL());
    }
  }, [existingStudent]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let photoBlob: ExternalBlob;

      if (photoFile) {
        const arrayBuffer = await photoFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        photoBlob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((percentage) => {
          setUploadProgress(percentage);
        });
      } else if (existingStudent) {
        photoBlob = existingStudent.photo;
      } else {
        toast.error('Please upload a photo');
        return;
      }

      if (isEditMode && studentId) {
        await updateStudent.mutateAsync({
          id: studentId,
          ...formData,
          photo: photoBlob,
        });
        toast.success('Student updated successfully');
      } else {
        await createStudent.mutateAsync({
          ...formData,
          photo: photoBlob,
        });
        toast.success('Student added successfully');
      }

      navigate({ to: '/manage/admissions' });
    } catch (error) {
      console.error('Failed to save student:', error);
      toast.error('Failed to save student');
    }
  };

  if (isEditMode && loadingStudent) {
    return <AppLoadingState message="Loading student details..." />;
  }

  if (isEditMode && loadError) {
    return <AppErrorState error={loadError} />;
  }

  const isSaving = createStudent.isPending || updateStudent.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: '/manage/admissions' })}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{isEditMode ? 'Edit Student' : 'Add New Student'}</h1>
          <p className="text-muted-foreground">
            {isEditMode ? 'Update student information' : 'Enter student admission details'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <Label htmlFor="photo">Student Photo</Label>
              <div className="flex items-center gap-4">
                {photoPreview && (
                  <img src={photoPreview} alt="Preview" className="w-24 h-24 rounded-lg object-cover" />
                )}
                <div className="flex-1">
                  <Input
                    id="photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="cursor-pointer"
                  />
                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <p className="text-sm text-muted-foreground mt-1">Uploading: {uploadProgress}%</p>
                  )}
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Student Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Parent Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fatherName">Father's Name *</Label>
                <Input
                  id="fatherName"
                  value={formData.fatherName}
                  onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="motherName">Mother's Name *</Label>
                <Input
                  id="motherName"
                  value={formData.motherName}
                  onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="caste">Caste *</Label>
                <Input
                  id="caste"
                  value={formData.caste}
                  onChange={(e) => setFormData({ ...formData, caste: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mobileNumber">Mobile Number *</Label>
                <Input
                  id="mobileNumber"
                  type="tel"
                  value={formData.mobileNumber}
                  onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* ID Numbers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="aadhaarNumber">Aadhaar Number *</Label>
                <Input
                  id="aadhaarNumber"
                  value={formData.aadhaarNumber}
                  onChange={(e) => setFormData({ ...formData, aadhaarNumber: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="penNumber">PEN Number *</Label>
                <Input
                  id="penNumber"
                  value={formData.penNumber}
                  onChange={(e) => setFormData({ ...formData, penNumber: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSaving} className="gap-2">
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditMode ? 'Updating...' : 'Adding...'}
                  </>
                ) : (
                  <>{isEditMode ? 'Update Student' : 'Add Student'}</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/manage/admissions' })}
                disabled={isSaving}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
