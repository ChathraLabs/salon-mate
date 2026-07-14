import { useEffect, useMemo, useState } from 'react';
import Masonry from 'react-responsive-masonry';
import { Armchair, Crown, Facebook, Hand, Images, Instagram, Scissors, SlidersHorizontal, Sparkles, Youtube } from 'lucide-react';

const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1776850476481-2bccba2e35c7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Modern salon haircut', label: 'Haircuts & Styling', category: 'hair' },
  { src: 'https://images.unsplash.com/photo-1588842867976-fd084ca2c87b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Bridal makeup', label: 'Bridal Looks', category: 'bridal' },
  { src: 'https://images.unsplash.com/photo-1654097801176-cb1795fd0c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Hair styling service', label: 'Hair Styling', category: 'hair' },
  { src: 'https://images.unsplash.com/photo-1600948836101-f9ffda59d250?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxvbiUyMGludGVyaW9yJTIwbW9kZXJufGVufDF8fHx8MTc3ODUxODE3NXww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Salon interior', label: 'Salon Interior', category: 'salon' },
  { src: 'https://images.unsplash.com/photo-1772322586754-34c9e6f5be6f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxuYWlsJTIwY2FyZSUyMG1hbmljdXJlfGVufDF8fHx8MTc3ODUxODE3NXww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Nail care service', label: 'Nail Care', category: 'nails' },
  { src: 'https://images.unsplash.com/photo-1641699862936-be9f49b1c38d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwyfHxicmlkYWwlMjBtYWtldXAlMjBiZWF1dHl8ZW58MXx8fHwxNzc4NTE4MTc0fDA&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Bridal styling', label: 'Makeup', category: 'bridal' },
  { src: 'https://images.unsplash.com/photo-1762745103094-6760fab8eb50?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Hair styling result', label: 'Fresh Layers', category: 'hair' },
  { src: 'https://images.unsplash.com/photo-1696835196034-cf22e2b72736?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Hair treatment', label: 'Hair Care', category: 'hair' },
  { src: 'https://images.unsplash.com/photo-1599387737838-660b75526801?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw3fHxzYWxvbiUyMGhhaXJjdXQlMjBzdHlsaW5nfGVufDF8fHx8MTc3ODUxODE2N3ww&ixlib=rb-4.1.0&q=80&w=1080', alt: 'Salon service', label: 'Skin & Facials', category: 'salon' },
];

const galleryFilters = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'hair', label: 'Hair', icon: Scissors },
  { id: 'bridal', label: 'Bridal', icon: Crown },
  { id: 'nails', label: 'Nails', icon: Hand },
  { id: 'salon', label: 'Salon', icon: Armchair },
];

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16.6 2c.4 3.2 2.2 5.1 5.4 5.3v3.6c-1.9.1-3.6-.4-5.2-1.5v6.7c0 4.3-2.8 6.9-6.8 6.9-3.8 0-6.6-2.5-6.6-6.1 0-3.9 3-6.5 7.4-6.2v3.8c-2-.3-3.5.6-3.5 2.3 0 1.4 1.1 2.3 2.6 2.3 1.8 0 2.9-1 2.9-3.2V2h3.8Z" />
    </svg>
  );
}

const gallerySocialLinks = [
  { href: 'https://www.facebook.com/DimmaGroup', Icon: Facebook, label: 'Facebook', color: '#1877f2' },
  { href: 'https://www.instagram.com/scissorkingdimma?igsh=MXJ5OXM3NnJxNnoybA==', Icon: Instagram, label: 'Instagram', color: '#e1306c' },
  { href: 'https://www.tiktok.com/@dimuthusrinathweerasinhe?_r=1&_t=ZS-97wDPxhyPUw', Icon: TikTokIcon, label: 'TikTok', color: '#101a17' },
  { href: 'https://www.youtube.com/@scissorkingdimma', Icon: Youtube, label: 'YouTube', color: '#ff0000' },
];

export function Gallery() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSlide, setActiveSlide] = useState(0);
  const filteredItems = useMemo(
    () => (activeFilter === 'all' ? galleryItems : galleryItems.filter((item) => item.category === activeFilter)),
    [activeFilter],
  );
  const sliderItems = filteredItems.length > 0 ? filteredItems : galleryItems;
  const normalizedSlide = activeSlide % sliderItems.length;

  useEffect(() => {
    setActiveSlide(0);
  }, [activeFilter]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % sliderItems.length);
    }, 3500);

    return () => window.clearTimeout(timer);
  }, [activeSlide, sliderItems.length]);

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
            <span className="salon-gallery__desktop-copy">Explore our portfolio of transformations, bridal styling, salon care, and satisfied clients.</span>
            <span className="salon-gallery__mobile-copy">Explore our latest transformations.</span>
          </p>
          <div className="salon-gallery__desktop-tags flex flex-wrap items-center justify-center gap-2 pt-2">
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

        <div className="salon-gallery__mobile-filters" aria-label="Gallery filters">
          {galleryFilters.map(({ id, label, icon: Icon }) => {
            const isActive = activeFilter === id;

            return (
              <button
                key={id}
                type="button"
                className="salon-gallery__filter-chip"
                onClick={() => setActiveFilter(id)}
                aria-pressed={isActive}
                style={{
                  background: isActive ? 'var(--emerald)' : 'var(--surface)',
                  color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)',
                  borderColor: isActive ? 'var(--emerald)' : 'var(--border)',
                }}
              >
                <Icon aria-hidden="true" />
                {label}
              </button>
            );
          })}
          <button type="button" className="salon-gallery__filter-action" aria-label="Filter gallery">
            <SlidersHorizontal aria-hidden="true" />
          </button>
        </div>

        <div className="salon-gallery__mobile-slider" aria-label="Featured gallery images">
          <div className="salon-gallery__slider-track" style={{ transform: `translateX(-${normalizedSlide * 100}%)` }}>
            {sliderItems.map((item) => (
              <article key={item.src} className="salon-gallery__slide">
                <img src={item.src} alt={item.alt} />
                <div className="salon-gallery__slide-overlay">
                  <span>{item.label}</span>
                </div>
              </article>
            ))}
          </div>
          <div className="salon-gallery__slider-dots" aria-hidden="true">
            {sliderItems.map((item, index) => (
              <span key={item.src} className={index === normalizedSlide ? 'is-active' : undefined} />
            ))}
          </div>
        </div>

        <div className="salon-gallery__mobile-grid">
          {filteredItems.slice(0, 6).map((item) => (
            <article key={item.src} className="salon-gallery__tile">
              <img src={item.src} alt={item.alt} />
              <div className="salon-gallery__tile-label">
                <Images aria-hidden="true" />
                {item.label}
              </div>
            </article>
          ))}
        </div>

        <div className="salon-gallery__mobile-social" aria-label="Follow Scissor King Dimma">
          <div>
            <h3>Follow Us</h3>
            <p>See more transformations & updates.</p>
          </div>
          <div className="salon-gallery__social-links">
            {gallerySocialLinks.map(({ href, Icon, label, color }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>
                <Icon className="w-5 h-5" style={{ color }} />
              </a>
            ))}
          </div>
        </div>

        <div className="salon-gallery__desktop-masonry">
          <Masonry columnsCount={3} columnsCountBreakPoints={{ 0: 2, 768: 3, 1280: 3 }} gutter="0.9rem">
            {galleryItems.map((image, index) => (
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
      </div>
    </section>
  );
}
