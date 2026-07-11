import type { PublicService } from '@/types/booking';

export type SalonServiceOption = {
  id: string;
  name: string;
  duration: number;
  price: number;
  defaultSelected?: boolean;
};

export type SalonService = {
  id: string;
  title: string;
  description: string;
  image: string;
  basePrice: number;
  baseDuration: number;
  options: SalonServiceOption[];
};

export type SalonStaffKey = 'dimuthu' | 'sanju' | 'salindee' | 'vinu';

export const salonStaffProfiles: Record<SalonStaffKey, { name: string; avatarUrl: string }> = {
  dimuthu: { name: 'Dimuthu Srinath Weerasinghe', avatarUrl: '/staff/Dimuthu.jpeg' },
  sanju: { name: 'Sanju Malawige', avatarUrl: '/staff/Sanju.png' },
  salindee: { name: 'Salindeee Weerasinghe', avatarUrl: '/staff/Salindee.png' },
  vinu: { name: 'Vinu Siriwardhana', avatarUrl: '/staff/Vinu.png' },
};

export const serviceStaffAssignments: Record<string, SalonStaffKey[]> = {
  'hair-cutting': ['dimuthu', 'sanju'],
  'hair-styling': ['dimuthu'],
  'manicure-pedicure': ['salindee', 'vinu'],
  'waxing-threading': ['salindee', 'vinu'],
  'fire-cut-dreadlocks': ['dimuthu'],
  'tattoo-piercing': ['dimuthu'],
  'makeup': ['dimuthu', 'salindee'],
  'bridal-dressing': ['dimuthu', 'salindee'],
  'groom-dressing': ['dimuthu'],
  'facial-cleanup': ['dimuthu', 'salindee', 'vinu', 'sanju'],
};

export const serviceStaffRoleLabels: Record<string, string> = {
  'hair-cutting': 'Barber',
  'hair-styling': 'Hair Stylist',
  'manicure-pedicure': 'Nail Technician',
  'waxing-threading': 'Beautician',
  'fire-cut-dreadlocks': 'Barber',
  'tattoo-piercing': 'Tattoo Artist',
  'makeup': 'Makeup Artist',
  'bridal-dressing': 'Bridal Stylist',
  'groom-dressing': 'Groom Stylist',
  'facial-cleanup': 'Beauty Therapist',
};

export const salonServices: SalonService[] = [
  {
    id: 'hair-cutting',
    title: 'Hair Cutting',
    description: 'Clean, precise haircuts and trims tailored to your face shape and style.',
    image: '/unsplash.com/services/HairCutting.png',
    basePrice: 2500,
    baseDuration: 45,
    options: [
      { id: 'hair-cut', name: 'Hair Cut', duration: 45, price: 2500, defaultSelected: true },
      { id: 'beard-cut', name: 'Beard Cut', duration: 20, price: 1000 },
      { id: 'kids-cut', name: 'Kids Cut', duration: 30, price: 1500 },
    ],
  },
  {
    id: 'hair-styling',
    title: 'Hair Styling',
    description: 'Blow dry, hair setting, color, and finishing for polished everyday or event looks.',
    image: '/unsplash.com/services/HairStyling.png',
    basePrice: 2500,
    baseDuration: 45,
    options: [
      { id: 'blow-dry', name: 'Blow Dry', duration: 45, price: 2500, defaultSelected: true },
      { id: 'hair-setting', name: 'Hair Setting', duration: 45, price: 3000 },
      { id: 'hair-coloring', name: 'Hair Coloring', duration: 120, price: 8000 },
      { id: 'hair-treatment', name: 'Hair Treatment', duration: 60, price: 4500 },
    ],
  },
  {
    id: 'manicure-pedicure',
    title: 'Manicure & Pedicure',
    description: 'Hand and foot care with shaping, cuticle care, polish, and optional gel finish.',
    image: '/unsplash.com/services/Manicure%26Pedicure.png',
    basePrice: 3500,
    baseDuration: 45,
    options: [
      { id: 'manicure', name: 'Manicure', duration: 45, price: 3500, defaultSelected: true },
      { id: 'pedicure', name: 'Pedicure', duration: 50, price: 4000 },
      { id: 'nail-art', name: 'Nail Art', duration: 30, price: 2000 },
      { id: 'gel-polish', name: 'Gel Polish', duration: 45, price: 3000 },
    ],
  },
  {
    id: 'waxing-threading',
    title: 'Waxing & Threading',
    description: 'Full body waxing, eyebrow threading, and facial hair removal.',
    image: '/unsplash.com/services/Waxing%26Threading.png',
    basePrice: 500,
    baseDuration: 20,
    options: [
      { id: 'eyebrow-threading', name: 'Eyebrow Threading', duration: 20, price: 500, defaultSelected: true },
      { id: 'face-threading', name: 'Face Threading', duration: 30, price: 1200 },
      { id: 'hand-waxing', name: 'Hand Waxing', duration: 35, price: 2500 },
      { id: 'full-body-waxing', name: 'Full Body Waxing', duration: 120, price: 8000 },
    ],
  },
  {
    id: 'fire-cut-dreadlocks',
    title: 'Fire Cut & Dreadlocks',
    description: 'Specialized fire-cut styling, dreadlock creation, and dreadlock maintenance.',
    image: '/unsplash.com/services/Firecut.png',
    basePrice: 4000,
    baseDuration: 60,
    options: [
      { id: 'fire-cut', name: 'Fire Cut', duration: 60, price: 4000, defaultSelected: true },
      { id: 'dreadlock-styling', name: 'Dreadlock Styling', duration: 120, price: 8000 },
      { id: 'dreadlock-maintenance', name: 'Dreadlock Maintenance', duration: 90, price: 6000 },
      { id: 'hair-pattern-design', name: 'Hair Pattern Design', duration: 45, price: 3500 },
    ],
  },
  {
    id: 'tattoo-piercing',
    title: 'Tattoo & Piercing',
    description: 'Tattoo consultation, tattoo sessions, and piercing services.',
    image: '/unsplash.com/services/Tatto.png',
    basePrice: 1000,
    baseDuration: 30,
    options: [
      { id: 'small-tattoo', name: 'Small Tattoo', duration: 60, price: 5000, defaultSelected: true },
      { id: 'medium-tattoo', name: 'Medium Tattoo', duration: 120, price: 12000 },
      { id: 'tattoo-consultation', name: 'Tattoo Consultation', duration: 30, price: 1000 },
      { id: 'ear-piercing', name: 'Ear Piercing', duration: 30, price: 3000 },
    ],
  },
  {
    id: 'makeup',
    title: 'Makeup',
    description: 'Party makeup, event makeup, lashes, and special occasion finishing.',
    image: '/unsplash.com/services/Makeup.png',
    basePrice: 5000,
    baseDuration: 90,
    options: [
      { id: 'party-makeup', name: 'Party Makeup', duration: 90, price: 5000, defaultSelected: true },
      { id: 'event-makeup', name: 'Event Makeup', duration: 120, price: 8000 },
      { id: 'lashes', name: 'Lashes', duration: 30, price: 2000 },
      { id: 'special-occasion-makeup', name: 'Special Occasion Makeup', duration: 150, price: 10000 },
    ],
  },
  {
    id: 'bridal-dressing',
    title: 'Bridal Dressing',
    description: 'Complete bridal makeup, hair styling, and saree draping services.',
    image: '/unsplash.com/services/Bridal%20Dressing.png',
    basePrice: 15000,
    baseDuration: 180,
    options: [
      { id: 'bridal-makeup', name: 'Bridal Makeup', duration: 180, price: 15000, defaultSelected: true },
      { id: 'bridal-hair-styling', name: 'Bridal Hair Styling', duration: 90, price: 8000 },
      { id: 'saree-draping', name: 'Saree Draping', duration: 45, price: 4000 },
      { id: 'bridal-trial-session', name: 'Bridal Trial Session', duration: 120, price: 10000 },
    ],
  },
  {
    id: 'groom-dressing',
    title: 'Groom Dressing',
    description: 'Groom makeup, hair styling, and beard styling for wedding and formal looks.',
    image: '/unsplash.com/services/GroomDressing.png',
    basePrice: 8000,
    baseDuration: 60,
    options: [
      { id: 'groom-makeup', name: 'Groom Makeup', duration: 60, price: 8000, defaultSelected: true },
      { id: 'groom-hair-styling', name: 'Groom Hair Styling', duration: 45, price: 3500 },
      { id: 'groom-dressing-support', name: 'Groom Dressing Support', duration: 45, price: 4000 },
      { id: 'photoshoot-touch-up', name: 'Photoshoot Touch-up', duration: 60, price: 5000 },
    ],
  },
  {
    id: 'facial-cleanup',
    title: 'Facial & Cleanup',
    description: 'Refreshing cleanup, facial treatments, masks, and skin-brightening care.',
    image: '/unsplash.com/services/Facial%26Cleanup.png',
    basePrice: 3500,
    baseDuration: 60,
    options: [
      { id: 'face-cleanup', name: 'Face Cleanup', duration: 60, price: 3500, defaultSelected: true },
      { id: 'basic-facial', name: 'Basic Facial', duration: 75, price: 5000 },
      { id: 'deep-cleansing-facial', name: 'Deep Cleansing Facial', duration: 90, price: 7000 },
      { id: 'face-mask-treatment', name: 'Face Mask Treatment', duration: 30, price: 2000 },
    ],
  },
];

export function formatServicePrice(price: number) {
  return price > 0 ? `LKR ${price.toLocaleString()}` : 'Contact for pricing';
}

export function formatServiceDuration(minutes: number) {
  if (minutes < 60) return `${minutes} min`;
  if (minutes % 60 === 0) return `${minutes / 60} hour${minutes === 60 ? '' : 's'}`;
  return `${Math.floor(minutes / 60)} hr ${minutes % 60} min`;
}

export function getSalonService(serviceId: string) {
  return salonServices.find((service) => service.id === serviceId) ?? null;
}

export function staffKeyForName(name: string): SalonStaffKey | null {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('dimuthu')) return 'dimuthu';
  if (lowerName.includes('sanju')) return 'sanju';
  if (lowerName.includes('salindee')) return 'salindee';
  if (lowerName.includes('vinu')) return 'vinu';

  return null;
}

export function staffAvatarForName(name: string) {
  const key = staffKeyForName(name);
  return key ? salonStaffProfiles[key].avatarUrl : null;
}

export function getStaffKeysForService(serviceId?: string | null) {
  if (!serviceId) return null;
  return serviceStaffAssignments[serviceId] ?? null;
}

export function getStaffRoleLabelForService(serviceId?: string | null) {
  if (!serviceId) return 'Barber';
  return serviceStaffRoleLabels[serviceId] ?? 'Barber';
}

export function isStaffAllowedForService(serviceId: string, staffName: string) {
  const assignedStaff = getStaffKeysForService(serviceId);
  const staffKey = staffKeyForName(staffName);

  return !assignedStaff || (staffKey !== null && assignedStaff.includes(staffKey));
}

export function toPublicService(service: SalonService): PublicService {
  return {
    id: service.id,
    name: service.title,
    description: service.description,
    priceCents: service.basePrice * 100,
    price: service.basePrice,
    durationMinutes: service.baseDuration,
    duration: formatServiceDuration(service.baseDuration),
  };
}

export const publicSalonServices = salonServices.map(toPublicService);
