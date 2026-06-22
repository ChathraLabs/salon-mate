import { Star, Quote } from 'lucide-react';

const reviews = [
  {
    name: 'Nethmi P.',
    rating: 5,
    text: 'Amazing service and very friendly staff. The bridal makeup was absolutely stunning and lasted throughout the entire ceremony. Highly recommended!',
    service: 'Bridal Makeup',
    initial: 'N',
  },
  {
    name: 'Kasun S.',
    rating: 5,
    text: "Best haircut I've had in Colombo! The stylist really understood what I wanted and delivered beyond my expectations. Will definitely come back.",
    service: 'Hair Styling',
    initial: 'K',
  },
  {
    name: 'Amaya R.',
    rating: 5,
    text: 'The facial treatment was so relaxing and my skin feels amazing. The products they use are high quality and the staff is very professional.',
    service: 'Facial Treatment',
    initial: 'A',
  },
  {
    name: 'Dinesh W.',
    rating: 4,
    text: 'Great atmosphere and professional service. The salon is very clean and modern. Reasonable prices for the quality of work.',
    service: 'Hair Coloring',
    initial: 'D',
  },
  {
    name: 'Thilini J.',
    rating: 5,
    text: 'I love my nails! The nail art is so detailed and beautiful. The manicurist was patient and made sure everything was perfect.',
    service: 'Nail Care',
    initial: 'T',
  },
  {
    name: 'Roshan M.',
    rating: 5,
    text: 'Excellent tattoo training program. Learned proper techniques and hygiene practices. The instructors are very experienced and supportive.',
    service: 'Tattoo Training',
    initial: 'R',
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />
      {/* Glow accent */}
      <div
        className="absolute left-0 top-1/3 w-64 h-64 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(212,165,32,0.05) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-14 space-y-3">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--gold)',
              fontSize: '0.75rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}
          >
            ✦ Testimonials ✦
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--foreground)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            }}
          >
            Client Reviews
          </h2>
          <p
            className="max-w-xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--muted-foreground)',
              fontSize: '1rem',
              lineHeight: '1.7',
            }}
          >
            Hear what our satisfied customers have to say about their experience
          </p>
          {/* Rating badge */}
          <div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full mt-2"
            style={{
              background: 'rgba(212,165,32,0.08)',
              border: '1px solid rgba(212,165,32,0.2)',
            }}
          >
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4" style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
              ))}
            </div>
            <span style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.85rem' }}>
              4.8 / 5 &nbsp;·&nbsp; 250+ reviews
            </span>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="relative p-7 rounded-2xl transition-all hover:-translate-y-0.5"
              style={{
                background: 'var(--card)',
                border: '1px solid var(--border)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.35)',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(212,165,32,0.3)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(212,165,32,0.1)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.35)';
              }}
            >
              {/* Quote icon */}
              <Quote
                className="absolute top-5 right-5 w-7 h-7"
                style={{ color: 'var(--gold-dark)', opacity: 0.25 }}
              />

              {/* Stars */}
              <div className="flex items-center gap-0.5 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5" style={{ fill: 'var(--gold)', color: 'var(--gold)' }} />
                ))}
              </div>

              {/* Text */}
              <p
                className="mb-6"
                style={{
                  fontFamily: 'var(--font-body)',
                  color: 'var(--muted-foreground)',
                  fontSize: '0.9rem',
                  lineHeight: '1.75',
                }}
              >
                {review.text}
              </p>

              {/* Footer */}
              <div
                className="flex items-center justify-between pt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, var(--gold-dark), var(--gold))',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
                      {review.initial}
                    </span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', color: 'var(--foreground)', fontSize: '0.875rem' }}>
                    {review.name}
                  </p>
                </div>
                <span
                  className="px-3 py-1 rounded-full"
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--gold)',
                    fontSize: '0.7rem',
                    background: 'rgba(212,165,32,0.1)',
                    border: '1px solid rgba(212,165,32,0.18)',
                    letterSpacing: '0.03em',
                  }}
                >
                  {review.service}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
