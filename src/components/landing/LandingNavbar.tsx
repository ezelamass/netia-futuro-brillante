import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Play, Eye } from 'lucide-react';

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Campus', href: '#campus' },
  { label: 'Avatares', href: '#avatares' },
  { label: 'Planes', href: '#planes' },
];

interface LandingNavbarProps {
  onDemoClick?: () => void;
  onTourClick?: () => void;
}

const LandingNavbar = ({ onDemoClick, onTourClick }: LandingNavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-heading font-bold text-secondary">
          Netia
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[18px] font-medium text-foreground hover:text-secondary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            className="rounded-full px-4 py-2 text-sm font-medium gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={onTourClick}
          >
            <Eye className="w-3.5 h-3.5" />
            Ver Tour
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-5 py-2 text-sm font-medium gap-1.5 border-secondary text-secondary hover:bg-secondary/10"
            onClick={onDemoClick}
          >
            <Play className="w-3.5 h-3.5" />
            Probar Demo
          </Button>
          <Link to="/register">
            <Button className="rounded-full px-6 py-2 text-[16px] font-medium">
              Inscribite
            </Button>
          </Link>
        </div>

        {/* Mobile right cluster: tour + demo always visible, rest in hamburger.
            We expose the two highest-intent CTAs so visitors don't have to open
            the menu to discover the demo. */}
        <div className="md:hidden flex items-center gap-2">
          <button
            type="button"
            onClick={onTourClick}
            aria-label="Ver tour"
            className="flex items-center justify-center w-10 h-10 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Eye className="w-5 h-5" />
          </button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-full h-10 px-4 text-sm font-medium gap-1.5 border-secondary text-secondary hover:bg-secondary/10"
            onClick={onDemoClick}
          >
            <Play className="w-3.5 h-3.5" />
            Demo
          </Button>
          <button
            className="p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menú"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu — section navigation + Inscribite. Tour and Demo are
          already in the always-visible top cluster, so they're omitted here. */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <div className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block py-3 text-base font-medium text-foreground hover:text-secondary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link to="/register" onClick={() => setMobileOpen(false)} className="mt-2">
              <Button className="rounded-full w-full h-11 text-base font-medium">
                Inscribite
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default LandingNavbar;
