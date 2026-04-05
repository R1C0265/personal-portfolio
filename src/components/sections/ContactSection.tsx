"use client";

import { useState } from "react";
import { z } from "zod";

const contactSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  email:   z.string().email("Enter a valid email"),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message is too short"),
});
type ContactFormData = z.infer<typeof contactSchema>;

// Initial empty form state — typed against our Zod-inferred type
const INITIAL_FORM: ContactFormData = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function ContactSection() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);

  // Zod returns a discriminated union: { success: true, data } | { success: false, error }
  // We store field-level errors as a partial record so we can show them per-field
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  // Generic change handler — works for all text inputs and textarea
  // [e.target.name] is computed property syntax: it sets the key dynamically
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as soon as the user starts typing
    if (errors[name as keyof ContactFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate with Zod before doing anything
    const result = contactSchema.safeParse(form);

    if (!result.success) {
      // Zod's flatten() converts the complex ZodError into a simple { fieldErrors } object
      const fieldErrors = result.error.flatten().fieldErrors;
      // Extract the first error message for each field
      setErrors(
        Object.fromEntries(
          Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])
        )
      );
      return;
    }

    setStatus("sending");

    // In a real app this would POST to an API route (e.g., /api/contact)
    // For now we just simulate a network delay
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("sent");
    setForm(INITIAL_FORM);
  };

  const inputClass = (field: keyof ContactFormData) =>
    `w-full bg-white/[0.04] border rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/25 outline-none focus:ring-1 transition-all duration-200 ${
      errors[field]
        ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/30"
        : "border-white/10 focus:border-blue-500/60 focus:ring-blue-500/20"
    }`;

  return (
    <section id="contact" className="py-24 bg-[#0f0f0f]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-blue-400 text-xs font-medium tracking-[0.3em] uppercase mb-3">
            Let&apos;s Talk
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white font-display">
            Contact
          </h2>
          <div className="w-12 h-0.5 bg-blue-400 mx-auto mt-4" />
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 font-display">
              Have a project in mind?
            </h3>
            <p className="text-white/50 text-sm leading-relaxed mb-8">
              I&apos;m available for freelance projects, full-time roles, and
              consulting. Drop me a message and I&apos;ll get back within 24 hours.
            </p>

            <div className="flex flex-col gap-4">
              {[
                { label: "Email", value: "ericzkabambe@gmail.com" },
                { label: "Phone", value: "+265 997 835 428 / +265 888 701 736" },
                { label: "Location", value: "Blantyre / Lilongwe, Malawi" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-4 bg-white/[0.03] border border-white/10 rounded-xl px-5 py-4"
                >
                  <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-white/40 text-xs mb-0.5">{label}</p>
                    <p className="text-white/80 text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-8">
            {status === "sent" ? (
              <div className="text-center py-10">
                <div className="text-4xl mb-4">✓</div>
                <h4 className="text-white font-bold text-lg mb-2">Message sent!</h4>
                <p className="text-white/50 text-sm">
                  Thanks for reaching out. I&apos;ll be in touch soon.
                </p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-blue-400 text-sm hover:text-blue-300 transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={inputClass("name")}
                    />
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1.5">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="Email address"
                      className={inputClass("email")}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1.5">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Subject"
                    className={inputClass("subject")}
                  />
                  {errors.subject && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.subject}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    rows={5}
                    className={`${inputClass("message")} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1.5">{errors.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full py-3 bg-blue-500 hover:bg-blue-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all duration-200 text-sm"
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
