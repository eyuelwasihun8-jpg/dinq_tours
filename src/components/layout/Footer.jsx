import { Link } from "react-router-dom";
import {
  Facebook,
  Instagram,
  Linkedin,
  Send,
  Phone,
  Mail,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { companyData } from "../../data/company";
import DinqLogo from "../DinqLogo";

const Footer = () => {
  const year = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Regions", to: "/regions" },
    { label: "Tours", to: "/tours" },
    { label: "Experiences", to: "/experiences" },
    { label: "Shop", to: "/shop" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
    { label: "Plan Your Trip", to: "/plan-your-trip" },
  ];

  const collections = [
    { label: "Safari", to: "/collections/safari" },
    { label: "UNESCO Sites", to: "/collections/unesco" },
    { label: "Festivals", to: "/collections/festivals" },
    { label: "Birding", to: "/collections/birding" },
    { label: "Mountains", to: "/mountains" },
    { label: "Signature Routes", to: "/signature-routes" },
  ];

  const socials = [
    {
      name: "Facebook",
      href: companyData.socials.facebook,
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: companyData.socials.instagram,
      icon: Instagram,
    },
    {
      name: "LinkedIn",
      href: companyData.socials.linkedin,
      icon: Linkedin,
    },
    {
      name: "Telegram",
      href: companyData.socials.telegram,
      icon: Send,
    },
  ].filter((s) => s.href); // only show links that exist

  return (
    <footer className="bg-[#0E0E10] text-stone-300 border-t border-stone-800/80">
      {/* Top brand strip */}
      <div className="border-b border-stone-800/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-4">
            <DinqLogo className="h-12 w-auto" />
            <div>
              <p className="font-serif text-xl text-[#FAF7F2] tracking-wide">
                {companyData.shortName}
              </p>
              <p className="text-xs uppercase tracking-[0.2em] text-[#C88A2E] mt-1">
                {companyData.name}
              </p>
            </div>
          </div>

          <p className="max-w-md text-sm text-stone-400 leading-relaxed italic font-serif">
            “{companyData.founderQuote}”
            <span className="block mt-2 not-italic text-xs text-stone-500">
              — {companyData.founder}, {companyData.founderTitle}
            </span>
          </p>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Column 1 — Contact */}
          <div>
            <h3 className="font-serif text-lg text-[#FAF7F2] mb-5">
              Get in Touch
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C88A2E] mt-0.5 shrink-0" />
                <span>
                  {companyData.address}
                  <br />
                  <span className="text-stone-500">{companyData.location}</span>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <div className="flex flex-col gap-1">
                  {companyData.phones.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="hover:text-[#D4AF7A] transition-colors"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C88A2E] shrink-0" />
                <a
                  href={`mailto:${companyData.contactEmail}`}
                  className="hover:text-[#D4AF7A] transition-colors break-all"
                >
                  {companyData.contactEmail}
                </a>
              </li>
            </ul>

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${companyData.whatsAppPhone}?text=${encodeURIComponent(
                `Hi Zerihun! 👋 I'd like to plan a trip with ${companyData.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-sm font-medium hover:bg-[#25D366]/20 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Column 2 — Explore */}
          <div>
            <h3 className="font-serif text-lg text-[#FAF7F2] mb-5">Explore</h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-1 text-stone-400 hover:text-[#D4AF7A] transition-colors group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Collections */}
          <div>
            <h3 className="font-serif text-lg text-[#FAF7F2] mb-5">
              Collections
            </h3>
            <ul className="space-y-2.5 text-sm">
              {collections.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-1 text-stone-400 hover:text-[#D4AF7A] transition-colors group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-y-0.5 group-hover:opacity-100 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Social + Newsletter note */}
          <div>
            <h3 className="font-serif text-lg text-[#FAF7F2] mb-5">
              Follow the Journey
            </h3>
            <p className="text-sm text-stone-500 mb-5 leading-relaxed">
              Stories from the field, upcoming departures, and living traditions
              across Ethiopia.
            </p>

            <div className="flex flex-wrap gap-3">
              {socials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-10 h-10 rounded-full border border-stone-700 flex items-center justify-center text-stone-400 hover:text-[#C88A2E] hover:border-[#C88A2E] hover:bg-[#C88A2E]/5 transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <p className="mt-6 text-xs text-stone-600 leading-relaxed">
              Formerly known as{" "}
              <span className="text-stone-500">{companyData.formerName}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone-600">
          <p>
            © {year} {companyData.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-stone-400 transition-colors">
              Contact
            </Link>
            <span className="text-stone-800">·</span>
            <Link to="/admin" className="hover:text-stone-400 transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;