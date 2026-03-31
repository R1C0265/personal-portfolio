// src/components/public/AboutClient.tsx
export function AboutClient() {
  return (
    <div className="px-4 py-6">
      <div className="mb-8">
        <p className="text-waku-gold text-xs font-semibold uppercase tracking-widest mb-1">Who we are</p>
        <h1 className="font-display text-3xl font-bold text-waku-green">About Waku Limited</h1>
      </div>

      <div className="bg-waku-green rounded-3xl p-6 text-white mb-6">
        <h2 className="font-display text-xl font-bold text-waku-gold mb-3">Your Trusted Agro Dealer</h2>
        <p className="text-white/80 leading-relaxed text-base">
          Waku Limited is a dedicated poultry supplier based in Lilongwe, Malawi. We supply quality
          day-old chicks, growers, and layer birds to households, small-scale farmers, and commercial
          producers across the country.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {[
          { emoji: "🌱", title: "Quality Stock",   desc: "All our birds are vaccinated and sourced from reliable hatcheries. We maintain strict biosecurity to deliver healthy stock every time." },
          { emoji: "🤝", title: "Customer First",  desc: "We work closely with every customer — whether you're buying 10 birds or 1,000. Our team is available by phone or WhatsApp." },
          { emoji: "📍", title: "Locally Rooted",  desc: "Based in Lilongwe Area 49, Baghdad, we understand the local market and the real needs of Malawian farmers." },
        ].map(({ emoji, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl p-5 shadow-card border border-gray-50 flex gap-4">
            <span className="text-2xl flex-shrink-0 mt-0.5">{emoji}</span>
            <div>
              <h3 className="font-semibold text-waku-green text-base mb-1">{title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-waku-gold-50 border border-waku-gold/20 rounded-2xl p-5">
        <h3 className="font-display font-bold text-waku-green text-lg mb-3">Our Breeds</h3>
        <div className="space-y-3">
          {[
            { name: "Kuroiler",   desc: "Dual-purpose — excellent growth rate and egg production" },
            { name: "Mikolongwe", desc: "Well-adapted to local conditions, popular with smallholder farmers" },
          ].map(({ name, desc }) => (
            <div key={name} className="flex gap-3">
              <span className="w-2 h-2 bg-waku-gold rounded-full mt-2 flex-shrink-0" />
              <div>
                <p className="font-semibold text-waku-green text-sm">{name}</p>
                <p className="text-gray-600 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
