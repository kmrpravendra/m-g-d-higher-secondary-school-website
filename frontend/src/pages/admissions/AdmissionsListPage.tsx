import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useSearchStudents } from '../../hooks/useQueries';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import AppLoadingState from '../../components/AppLoadingState';
import AppErrorState from '../../components/AppErrorState';
import { Plus, Search, User } from 'lucide-react';

export default function AdmissionsListPage() {
  const navigate = useNavigate();
  const [nameFilter, setNameFilter] = useState('');
  const [mobileFilter, setMobileFilter] = useState('');
  const { data: students, isLoading, error } = useSearchStudents(nameFilter, mobileFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Student Admissions</h1>
          <p className="text-muted-foreground">Manage student profiles and admissions</p>
        </div>
        <Link to="/manage/admissions/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add Student
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by mobile number..."
                value={mobileFilter}
                onChange={(e) => setMobileFilter(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && <AppLoadingState message="Loading students..." />}
      {error && <AppErrorState error={error} />}

      {!isLoading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {students && students.length > 0 ? (
            students.map((student) => (
              <Card
                key={student.id}
                className="hover:border-primary/50 transition-colors cursor-pointer h-full"
                onClick={() => navigate({ to: '/manage/admissions/$studentId', params: { studentId: student.id } })}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg truncate">{student.name}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        Father: {student.fatherName}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Mobile: {student.mobileNumber}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">DOB: {student.dateOfBirth}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No students found</h3>
              <p className="text-muted-foreground mb-4">
                {nameFilter || mobileFilter
                  ? 'Try adjusting your search filters'
                  : 'Get started by adding your first student'}
              </p>
              <Link to="/manage/admissions/new">
                <Button>Add Student</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
