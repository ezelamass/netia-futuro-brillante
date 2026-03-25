import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Nosotros', href: '#nosotros' },
  { label: 'Campus', href: '#campus' },
  { label: 'Avatares', href: '#avatares' },
  { label: 'Planes', href: '#planes' },
];

const LandingNavbar = () => {
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
          <button
            className="p-2 text-foreground hover:text-secondary transition-colors"
            aria-label="Buscar"
          >
            <Search className="w-5 h-5" />
          </button>
          <Link to="/register">
            <Button className="rounded-full px-6 py-2 text-[16px] font-medium">
              Inscribite
            </Button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t px-4 pb-4">
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[18px] font-medium text-foreground hover:text-secondary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link to="/register" onClick={() => setMobileOpen(false)}>
              <Button className="rounded-full w-full text-[16px] font-medium">
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
