import Masonry from 'react-responsive-masonry';

const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1776850476481-2bccba2e35c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Modern salon haircut' },
  { src: 'https://images.unsplash.com/photo-1588842867976-fd084ca2c87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Bridal makeup' },
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
    <section id="gallery" className="salon-gallery py-20 sm:py-24 relative overflow-hidden" style={{ background: 'var(--background)' }}>
      <div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(to right, transparent, rgba(138,95,34,0.18), transparent)' }}
      />

      <div className="salon-section-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="salon-section-header text-center mb-10 sm:mb-14 space-y-4">
          <p
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--gold-dark)',
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            Our Work
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              color: 'var(--emerald)',
              fontSize: 'clamp(2.2rem, 8vw, 3.25rem)',
              lineHeight: '1.05',
            }}
          >
            Gallery
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{
              fontFamily: 'var(--font-body)',
              color: 'var(--muted-foreground)',
              fontSize: '1rem',
              lineHeight: '1.7',
            }}
          >
            Explore our portfolio of transformations, bridal styling, salon care, and satisfied clients.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {['Hair craft', 'Bridal detail', 'Salon moments'].map((label) => (
              <span
                key={label}
                className="rounded-full px-4 py-2"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-soft)',
                  color: 'var(--emerald)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.84rem',
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>

        <Masonry columnsCount={3} columnsCountBreakPoints={{ 0: 2, 768: 3, 1280: 3 }} gutter="0.9rem">
          {galleryImages.map((image, index) => (
            <div
              key={index}
              className="relative overflow-hidden group"
              style={{
                borderRadius: '1.25rem',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-card)',
                background: 'var(--surface)',
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-auto transition-transform duration-500 group-hover:scale-105"
                style={{ display: 'block' }}
              />
              <div
                className="absolute inset-0 flex items-end p-3 sm:p-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(to top, rgba(16,33,29,0.72) 0%, transparent 58%)' }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: 'var(--primary-foreground)',
                    fontSize: '0.825rem',
                  }}
                >
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </Masonry>
      </div>
    </section>
  );
}
