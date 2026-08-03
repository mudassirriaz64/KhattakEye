import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { footerLinks } from "@/lib/landing-data";

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[color:var(--color-panel)]">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-brand-soft)] to-transparent" />
      <div className="pointer-events-none absolute -top-32 right-10 h-80 w-80 rounded-full bg-[color:var(--color-brand-soft)]/15 blur-3xl" />

      <div className="mx-auto max-w-[1440px] px-4 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/khattak.png"
                alt="Khattak Eyewear"
                className="h-12 w-12 object-contain"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-3xl font-semibold text-[color:var(--color-text-primary)]">Khattak</span>
                <span className="mt-1 text-[10px] font-medium uppercase tracking-[0.34em] text-[color:var(--color-text-tertiary)]">Eyewear</span>
              </span>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-[color:var(--color-text-secondary)]">
              Premium eyewear crafted for modern lifestyles. Italian acetates, Japanese titanium, and
              German-engineered lenses — finished by hand in Lahore.
            </p>

            <div className="mt-7 flex gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -3, scale: 1.05 }}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-brand-primary)] hover:bg-[color:var(--color-brand-primary)] hover:text-white"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            {[
              { title: "Company", links: footerLinks.company },
              { title: "Shop", links: footerLinks.shop },
              { title: "Support", links: footerLinks.support },
            ].map((section) => (
              <div key={section.title}>
                <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.26em] text-[color:var(--color-brand-primary)]">
                  {section.title}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="group relative inline-flex items-center gap-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 text-[color:var(--color-brand-primary)] opacity-0 transition-all duration-300 group-hover:opacity-100" />
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[color:var(--color-brand-primary)] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 grid gap-8 border-t border-[color:var(--color-border)] pt-10 lg:grid-cols-3">
          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-brand-primary)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">Call us</p>
              <a href={`tel:${footerLinks.contact.phone}`} className="mt-1 block text-sm font-medium text-[color:var(--color-text-primary)] hover:text-[color:var(--color-brand-primary)]">
                {footerLinks.contact.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-brand-primary)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">Write to us</p>
              <a href={`mailto:${footerLinks.contact.email}`} className="mt-1 block text-sm font-medium text-[color:var(--color-text-primary)] hover:text-[color:var(--color-brand-primary)]">
                {footerLinks.contact.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-brand-primary)]" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--color-text-tertiary)]">Visit the atelier</p>
              <p className="mt-1 text-sm font-medium text-[color:var(--color-text-primary)]">
                {footerLinks.contact.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-[color:var(--color-border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="text-xs text-[color:var(--color-text-tertiary)]">
              &copy; {new Date().getFullYear()} Khattak Eyewear. All rights reserved.
            </p>
            <div className="flex items-center gap-5 text-xs text-[color:var(--color-text-tertiary)]">
              <Link to="/privacy" className="transition-colors hover:text-[color:var(--color-brand-primary)]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="transition-colors hover:text-[color:var(--color-brand-primary)]">
                Terms of Service
              </Link>
              <span className="hidden sm:inline">Crafted with care in Lahore</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
