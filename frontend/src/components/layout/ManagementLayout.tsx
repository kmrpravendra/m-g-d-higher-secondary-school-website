import { Link, useRouterState } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import LoginButton from '../auth/LoginButton';
import { GraduationCap, Users, Calendar, DollarSign, FileText, ClipboardList } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';

export default function ManagementLayout({ children }: { children: React.ReactNode }) {
  const { data: userProfile } = useGetCallerUserProfile();
  const router = useRouterState();
  const currentPath = router.location.pathname;

  const navItems = [
    { path: '/manage/admissions', label: 'Admissions', icon: Users },
    { path: '/manage/attendance', label: 'Attendance', icon: Calendar },
    { path: '/manage/fees', label: 'Fees', icon: DollarSign },
    { path: '/manage/monthly-tests', label: 'Monthly Tests', icon: FileText },
    { path: '/manage/exams', label: 'Exams', icon: ClipboardList },
  ];

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <GraduationCap className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">M.G.D. School Management</h1>
                <p className="text-xs text-muted-foreground">Administrative Portal</p>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              {userProfile && (
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(userProfile.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden sm:inline">{userProfile.name}</span>
                </div>
              )}
              <LoginButton />
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        <aside className="w-64 border-r bg-card/30 hidden lg:block">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath.startsWith(item.path);
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className="w-full justify-start gap-3"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-6 lg:px-8">{children}</div>
        </main>
      </div>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 border-t bg-card/95 backdrop-blur-sm z-50">
        <nav className="flex justify-around p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath.startsWith(item.path);
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className="flex-col h-auto py-2 px-3 gap-1"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label.split(' ')[0]}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
