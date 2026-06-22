import Masonry from 'react-responsive-masonry';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1776850476481-2bccba2e35c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Modern salon haircut' },
  { src: 'https://images.unsplash.com/photo-1588842867976-fd084ca2c87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Bridal makeup' },
  { src: 'https://images.unsplash.com/photo-1654097801176-cb1795fd0c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Hair styling service' },
  { src: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3ODUxODE3NXww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Salon interior' },
  { src: 'https://images.unsplash.com/photo-1772322586754-34c9e6f5be6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxuYWlsJTIwY2FyZSUyMG1hbmljdXJlfGVufDF8fHx8MTc3ODUxODE3NXww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Nail care service' },
  { src: 'https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Bridal styling' },
  { src: 'https://images.unsplash.com/photo-1762745103094-6760fab8eb50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Hair styling result' },
  { src: 'https://images.unsplash.com/photo-1696835196034-cf22e2b72736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Hair treatment' },
  { src: 'https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Salon service' },
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 relative overflow-hidden" style={{ background: 'var(--muted)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(212,165,32,0.3), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            ✦ Our Work ✦
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--foreground)',
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
            }}
          >
            Gallery
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
            Explore our portfolio of stunning transformations and satisfied clients
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="h-px w-16" style={{ background: 'linear-gradient(to right, transparent, var(--gold-dark))' }} />
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
            <div className="h-px w-16" style={{ background: 'linear-gradient(to left, transparent, var(--gold-dark))' }} />
          </div>
        </div>

        <Masonry columnsCount={3} gutter="0.75rem">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden cursor-pointer group"
              style={{
                borderRadius: '0.875rem',
                border: '1px solid var(--border)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(212,165,32,0.4)')}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                style={{ display: 'block' }}
              />
              {/* Hover overlay */}
              <div
                className="absolute inset-0 flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(6,4,2,0.85) 0%, transparent 55%)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--foreground)',
                    fontSize: '0.825rem',
                    letterSpacing: '0.03em',
                  }}
                >
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </Masonry>

        <div className="text-center mt-12">
          <button
            style={{
              fontFamily: 'var(--font-body)',
              border: '1px solid rgba(212,165,32,0.35)',
              color: 'var(--foreground)',
              borderRadius: '9999px',
              padding: '0.8rem 2.25rem',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'all 0.2s',
              letterSpacing: '0.04em',
              fontSize: '0.9rem',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,165,32,0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--gold)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold-light)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(212,165,32,0.35)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--foreground)';
            }}
          >
            View More
          </button>
        </div>
      </div>
    </section>
  );
}
