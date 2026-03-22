import { Link } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { GraduationCap, Users, Calendar, DollarSign, Award, Phone, MapPin } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';

export default function PublicHome() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const features = [
    {
      icon: Users,
      title: 'Student Admissions',
      description: 'Comprehensive student profile management with all essential details',
    },
    {
      icon: Calendar,
      title: 'Attendance Tracking',
      description: 'Daily attendance records with historical data and reports',
    },
    {
      icon: DollarSign,
      title: 'Fee Management',
      description: 'Track fee submissions and payment history for all students',
    },
    {
      icon: Award,
      title: 'Academic Records',
      description: 'Monthly tests and exam results management system',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/5 py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <GraduationCap className="h-4 w-4" />
                Excellence in Education
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                M.G.D. Higher Secondary School
              </h1>
              <p className="text-xl text-muted-foreground">
                Empowering students with quality education and comprehensive management systems
              </p>
              <div className="flex flex-wrap gap-4">
                {isAuthenticated ? (
                  <Link to="/manage/admissions">
                    <Button size="lg" className="gap-2">
                      <Users className="h-5 w-5" />
                      Go to Management
                    </Button>
                  </Link>
                ) : (
                  <Button size="lg" disabled>
                    Login to Access Management
                  </Button>
                )}
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/home-hero.dim_1600x600.png"
                alt="School Building"
                className="rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Management Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive school management system helps streamline administrative tasks
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h2>
              <p className="text-lg text-muted-foreground">
                Get in touch with our school administration
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="font-medium">M.G.D. Higher Secondary School</p>
                  <p className="text-muted-foreground">Sarsawa, Sahawar</p>
                  <p className="text-muted-foreground">Kasganj, Uttar Pradesh</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5 text-primary" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Principal</p>
                    <p className="font-medium">Mr. Pravendra Kumar</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Numbers</p>
                    <p className="font-medium">9410010341</p>
                    <p className="font-medium">7467070958</p>
                  </div>
                  <div>
                    <a
                      href="https://instagram.com/mgd_sahawar_ksj"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-primary hover:underline"
                    >
                      <SiInstagram className="h-4 w-4" />
                      @mgd_sahawar_ksj
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
