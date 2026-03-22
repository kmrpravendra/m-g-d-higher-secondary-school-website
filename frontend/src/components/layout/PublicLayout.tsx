import { Link } from '@tanstack/react-router';
import LoginButton from '../auth/LoginButton';
import { GraduationCap } from 'lucide-react';
import { SiInstagram } from 'react-icons/si';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <img
                src="/assets/generated/school-crest.dim_512x512.png"
                alt="M.G.D. School Crest"
                className="h-12 w-12 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold text-foreground">M.G.D. Higher Secondary School</h1>
                <p className="text-sm text-muted-foreground">Excellence in Education</p>
              </div>
            </Link>
            <LoginButton />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t bg-card/30 mt-auto">
        <div className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">M.G.D. Higher Secondary School</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Sarsawa, Sahawar, Kasganj
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Contact</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Principal: Mr. Pravendra Kumar</p>
                <p>Phone: 9410010341</p>
                <p>Phone: 7467070958</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Connect</h3>
              <a
                href="https://instagram.com/mgd_sahawar_ksj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="h-4 w-4" />
                @mgd_sahawar_ksj
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>
              © 2026. Built with <span className="text-red-500">♥</span> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
