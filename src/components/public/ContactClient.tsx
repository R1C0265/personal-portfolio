// src/components/public/ContactClient.tsx
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";

const CONTACTS = [
  { Icon: Phone,         label: "Call us",       value: "+265 999 793 842", href: "tel:+265999793842" },
  { Icon: Phone,         label: "Alternative",   value: "+265 984 243 111", href: "tel:+265984243111" },
  { Icon: Phone,         label: "Alternative",   value: "+265 889 575 314", href: "tel:+265889575314" },
  { Icon: MessageCircle, label: "WhatsApp",       value: "+265 999 793 842", href: "https://wa.me/265999793842", ext: true },
  { Icon: Mail,          label: "Email",          value: "ulunji@yahoo.com",           href: "mailto:ulunji@yahoo.com" },
  { Icon: Mail,          label: "Email",          value: "wakulimited3@gmail.com",      href: "mailto:wakulimited3@gmail.com" },
];

export function ContactClient() {
  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <p className="text-waku-gold text-xs font-semibold uppercase tracking-widest mb-1">Reach us</p>
        <h1 className="font-display text-3xl font-bold text-waku-green">Contact Us</h1>
      </div>

      <div className="bg-waku-green rounded-2xl p-4 text-white flex gap-3 mb-6">
        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center flex-shrink-0">
          <MapPin size={18} className="text-waku-gold" />
        </div>
        <div>
          <p className="font-semibold text-waku-gold text-sm mb-0.5">Our Location</p>
          <p className="text-white/80 text-sm leading-relaxed">
            Lilongwe Area 49, Baghdad &amp; Njewa<br />opposite Baron Estates
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {CONTACTS.map(({ Icon, label, value, href, ext }) => (
          <a key={`${label}-${value}`} href={href}
            {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-card border border-gray-50
                       active:bg-gray-50 transition-colors min-h-[68px]">
            <div className="w-11 h-11 bg-waku-green-50 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon size={18} className="text-waku-green" />
            </div>
            <div>
              <p className="text-gray-500 text-xs mb-0.5">{label}</p>
              <p className="font-semibold text-gray-900 text-base">{value}</p>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-6 bg-waku-gold-50 border border-waku-gold/20 rounded-2xl p-4 text-center">
        <p className="text-waku-green font-semibold text-sm">Business Hours</p>
        <p className="text-gray-600 text-sm mt-1">Monday – Saturday · 7:00am – 6:00pm</p>
        <p className="text-gray-500 text-xs mt-1">Sunday by appointment only</p>
      </div>
    </div>
  );
}
