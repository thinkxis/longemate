export interface Category {
  id: string;
  name: string;
  icon: string;          // Tabler icon name e.g. 'sparkles'
  description: string;
  responseTime: string;  // e.g. '~2 hr response'
  startingPrice: string; // e.g. 'From ₹499'
}
 
export const CATEGORIES: Category[] = [
  {
    id: 'cleaning',
    name: 'Cleaning',
    icon: 'cleaning_services',
    description: 'Home, office, or deep clean',
    responseTime: '~2 hr response',
    startingPrice: 'From ₹499'
  },
  {
    id: 'electrician',
    name: 'Electrician',
    icon: 'electrical_services',
    description: 'Wiring, fittings, repairs',
    responseTime: '~3 hr response',
    startingPrice: 'From ₹299'
  },
  {
    id: 'plumber',
    name: 'Plumber',
    icon: 'plumbing',
    description: 'Leaks, pipes, fixtures',
    responseTime: '~2 hr response',
    startingPrice: 'From ₹349'
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    icon: 'carpenter',
    description: 'Furniture, doors, custom work',
    responseTime: '~4 hr response',
    startingPrice: 'From ₹399'
  },
  {
    id: 'massage',
    name: 'Massage',
    icon: 'spa',
    description: 'Relaxation or therapeutic',
    responseTime: '~3 hr response',
    startingPrice: 'From ₹699'
  },
  {
    id: 'salon',
    name: 'Salon',
    icon: 'content_cut',
    description: 'Hair, beauty, grooming',
    responseTime: '~2 hr response',
    startingPrice: 'From ₹299'
  },
  {
    id: 'painting',
    name: 'Painting',
    icon: 'format_paint',
    description: 'Interior, exterior, textures',
    responseTime: '~5 hr response',
    startingPrice: 'From ₹599'
  },
  {
    id: 'welder',
    name: 'Welder',
    icon: 'construction',
    description: 'Gates, grills, fabrication',
    responseTime: '~5 hr response',
    startingPrice: 'From ₹499'
  },
  {
    id: 'cooking',
    name: 'Cooking',
    icon: 'restaurant',
    description: 'Catering, home chef, events',
    responseTime: '~4 hr response',
    startingPrice: 'From ₹799'
  },
];