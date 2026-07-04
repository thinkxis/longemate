export interface Category {
  id: string;
  name: string;
  icon: string;          // Tabler icon name e.g. 'sparkles'
  description: string;
  responseTime: string;  // e.g. '~2 hr'
  startingPrice: string; // e.g. 'From ₹499'
}
 
export const CATEGORIES: Category[] = [
  {
    id: 'hotel',
    name: 'Hotels',
    icon: 'hotel',
    description: 'Hotels of every budget',
    responseTime: 'Instant',
    startingPrice: 'From ₹499'
  },
  {
    id: 'lodge',
    name: 'Lodges',
    icon: 'bed',
    description: 'Affordable overnight stays',
    responseTime: 'Instant',
    startingPrice: 'From ₹299'
  },
  {
    id: 'guest-house',
    name: 'Guest Houses',
    icon: 'home',
    description: 'Comfortable private stays',
    responseTime: 'Instant',
    startingPrice: 'From ₹399'
  },
  {
    id: 'hostel',
    name: 'Hostels',
    icon: 'groups',
    description: 'Beds & shared accommodation',
    responseTime: 'Instant',
    startingPrice: 'From ₹199'
  },
  {
    id: 'resort',
    name: 'Resorts',
    icon: 'beach_access',
    description: 'Vacation & leisure stays',
    responseTime: 'Instant',
    startingPrice: 'From ₹1,499'
  },
  {
    id: 'apartment',
    name: 'Apartments',
    icon: 'apartment',
    description: 'Entire apartments & studios',
    responseTime: 'Instant',
    startingPrice: 'From ₹999'
  },
  {
    id: 'villa',
    name: 'Villas',
    icon: 'villa',
    description: 'Luxury private villas',
    responseTime: 'Instant',
    startingPrice: 'From ₹2,999'
  },
  {
    id: 'homestay',
    name: 'Homestays',
    icon: 'cottage',
    description: 'Local homes & family stays',
    responseTime: 'Instant',
    startingPrice: 'From ₹599'
  },
  {
    id: 'hourly',
    name: 'Hourly Stay',
    icon: 'schedule',
    description: 'Book rooms for a few hours',
    responseTime: 'Instant',
    startingPrice: 'From ₹299'
  },
  {
    id: 'overnight',
    name: 'Overnight',
    icon: 'night_shelter',
    description: 'One-night accommodation',
    responseTime: 'Instant',
    startingPrice: 'From ₹499'
  },
  {
    id: 'business',
    name: 'Business Stay',
    icon: 'business_center',
    description: 'Work trips & conferences',
    responseTime: 'Instant',
    startingPrice: 'From ₹799'
  },
  {
    id: 'family',
    name: 'Family Rooms',
    icon: 'family_restroom',
    description: 'Spacious family accommodation',
    responseTime: 'Instant',
    startingPrice: 'From ₹1,199'
  }
];