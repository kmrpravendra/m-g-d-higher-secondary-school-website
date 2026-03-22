import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import PublicLayout from './components/layout/PublicLayout';
import ManagementLayout from './components/layout/ManagementLayout';
import RequireAuth from './components/auth/RequireAuth';
import ProfileSetupDialog from './components/auth/ProfileSetupDialog';
import PublicHome from './pages/PublicHome';
import AdmissionsListPage from './pages/admissions/AdmissionsListPage';
import StudentFormPage from './pages/admissions/StudentFormPage';
import StudentDetailPage from './pages/admissions/StudentDetailPage';
import AttendancePage from './pages/attendance/AttendancePage';
import FeesPage from './pages/fees/FeesPage';
import MonthlyTestsPage from './pages/tests/MonthlyTestsPage';
import ExamsPage from './pages/exams/ExamsPage';

// Root route with layout wrapper
const rootRoute = createRootRoute({
  component: () => (
    <>
      <ProfileSetupDialog />
      <Outlet />
    </>
  ),
});

// Public routes
const publicRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <PublicLayout>
      <Outlet />
    </PublicLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => publicRoute,
  path: '/',
  component: PublicHome,
});

// Management routes (authenticated)
const managementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manage',
  component: () => (
    <RequireAuth>
      <ManagementLayout>
        <Outlet />
      </ManagementLayout>
    </RequireAuth>
  ),
});

const admissionsRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/admissions',
  component: AdmissionsListPage,
});

const admissionsCreateRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/admissions/new',
  component: StudentFormPage,
});

const admissionsEditRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/admissions/edit/$studentId',
  component: StudentFormPage,
});

const admissionsDetailRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/admissions/$studentId',
  component: StudentDetailPage,
});

const attendanceRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/attendance',
  component: AttendancePage,
});

const feesRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/fees',
  component: FeesPage,
});

const monthlyTestsRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/monthly-tests',
  component: MonthlyTestsPage,
});

const examsRoute = createRoute({
  getParentRoute: () => managementRoute,
  path: '/exams',
  component: ExamsPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  publicRoute.addChildren([indexRoute]),
  managementRoute.addChildren([
    admissionsRoute,
    admissionsCreateRoute,
    admissionsEditRoute,
    admissionsDetailRoute,
    attendanceRoute,
    feesRoute,
    monthlyTestsRoute,
    examsRoute,
  ]),
]);

// Create router
const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
