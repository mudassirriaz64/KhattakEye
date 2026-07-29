import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Glasses,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
} from "lucide-react";
import { footerLinks } from "@/lib/landing-data";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-border)] bg-[color:var(--color-surface-muted)]">
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-8 md:py-20">
        <ScrollReveal>
          <motion.div
            className="grid gap-10 md:grid-cols-2 lg:grid-cols-5"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
            }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div
              className="lg:col-span-1"
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/" className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--color-brand-primary)] text-white">
                  <Glasses className="h-5 w-5" />
                </div>
                <span className="font-display text-2xl text-[color:var(--color-text-primary)]">
                  Khattak
                </span>
              </Link>
              <p className="mt-4 max-w-xs text-sm leading-7 text-[color:var(--color-text-secondary)]">
                Premium eyewear crafted for modern lifestyles. Italian acetates, Japanese titanium, and German-engineered lenses.
              </p>
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -3, scale: 1.05 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--color-border)] text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-accent-teal)] hover:text-[color:var(--color-accent-teal)]"
                    aria-label={social.label}
                  >
                    <social.icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {[
              { title: "Company", links: footerLinks.company },
              { title: "Shop", links: footerLinks.shop },
              { title: "Support", links: footerLinks.support },
            ].map((section) => (
              <motion.div
                key={section.title}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                  {section.title}
                </p>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.path}
                        className="group relative inline-flex text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                      >
                        {link.label}
                        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[color:var(--color-accent-teal)] transition-all duration-300 group-hover:w-full" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.div
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--color-text-secondary)]">
                Contact
              </p>
              <ul className="space-y-4">
                <li>
                  <a
                    href={`tel:${footerLinks.contact.phone}`}
                    className="group flex items-center gap-3 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[color:var(--color-accent-teal)] transition-transform group-hover:scale-110" />
                    {footerLinks.contact.phone}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${footerLinks.contact.email}`}
                    className="group flex items-center gap-3 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[color:var(--color-accent-teal)] transition-transform group-hover:scale-110" />
                    {footerLinks.contact.email}
                  </a>
                </li>
                <li className="group flex items-start gap-3 text-sm text-[color:var(--color-text-secondary)]">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[color:var(--color-accent-teal)] transition-transform group-hover:scale-110" />
                  {footerLinks.contact.address}
                </li>
              </ul>
            </motion.div>
          </motion.div>
        </ScrollReveal>

        <div className="mt-14 border-t border-[color:var(--color-border)] pt-8">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
            <p className="flex items-center gap-1 text-xs text-[color:var(--color-text-tertiary)]">
              &copy; {new Date().getFullYear()} Khattak Eyewear. Made with
              <Heart className="inline h-3 w-3 text-[color:var(--color-danger)]" />
              in Pakistan.
            </p>
            <div className="flex items-center gap-4 text-xs text-[color:var(--color-text-tertiary)]">
              <Link to="/privacy" className="hover:text-[color:var(--color-text-secondary)]">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-[color:var(--color-text-secondary)]">
                Terms of Service
              </Link>
              <span>All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
