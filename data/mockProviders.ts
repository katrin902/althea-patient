export interface Provider {
  id: string;
  name: string;
  type: string;
  city: string;
  distance: string;
  waitingTime: string;
  specializations: string[];
  languages: string[];
  insurance: string[];
  studentExperience: boolean;
  onlineAvailable: boolean;
  acceptingPatients: boolean;
  description: string;
  address: string;
  coordinates: { lat: number; lng: number };
  specialists: string[];
  crisisPolicy: string;
  recommendationReason?: string;
  officeHours: string;
  treatmentFormat: 'in-person' | 'online' | 'hybrid';
  websiteUrl: string;
  rating: number;
  reviewCount: number;
}

export const mockProviders: Provider[] = [
  {
    id: 'p1',
    name: 'Amsterdam Mental Health Center',
    type: 'GGZ',
    city: 'Amsterdam',
    distance: '1.2 km',
    waitingTime: '4 weeks',
    specializations: ['Anxiety', 'Depression', 'Burnout', 'Stress', 'Young adults'],
    languages: ['Dutch', 'English'],
    insurance: ['CZ', 'Menzis', 'Zilveren Kruis', 'VGZ'],
    studentExperience: true,
    onlineAvailable: true,
    acceptingPatients: true,
    description:
      'A leading mental health center in Amsterdam specializing in young adults and students. Our team of experienced psychologists and therapists offers evidence-based treatments including CBT, EMDR, and mindfulness-based therapy.',
    address: 'Herengracht 182, 1016 BR Amsterdam',
    coordinates: { lat: 52.3718, lng: 4.8951 },
    specialists: ['Dr. Lisa van Berg', 'Dr. Mark Jansen', 'Dr. Anna de Vries'],
    crisisPolicy: 'Crisis support line available during office hours. For acute emergencies, call 112.',
    recommendationReason:
      'Recommended based on your symptoms, insurance type, distance, and experience with students.',
    officeHours: 'Mon–Fri 08:30–17:30',
    treatmentFormat: 'hybrid',
    websiteUrl: 'https://amhc.nl',
    rating: 4.7,
    reviewCount: 312,
  },
  {
    id: 'p2',
    name: 'GGZ Noord-Holland',
    type: 'GGZ',
    city: 'Amsterdam',
    distance: '2.8 km',
    waitingTime: '6 weeks',
    specializations: ['Trauma', 'PTSD', 'Depression', 'Anxiety', 'OCD'],
    languages: ['Dutch', 'English', 'Arabic'],
    insurance: ['CZ', 'Menzis', 'VGZ', 'IZA'],
    studentExperience: true,
    onlineAvailable: true,
    acceptingPatients: true,
    description:
      'GGZ Noord-Holland provides specialized mental healthcare for adults and young adults. We offer both individual and group therapy programs with a focus on evidence-based treatment.',
    address: 'Oosterdokskade 5, 1011 AD Amsterdam',
    coordinates: { lat: 52.3788, lng: 4.9061 },
    specialists: ['Dr. Pieter Smit', 'Dr. Sophie Bakker', 'Dr. Youssef El-Amin'],
    crisisPolicy: 'Refer to GP or call 112 for acute crises. 113 Suicide Prevention: 0800-0113.',
    recommendationReason: 'Good match for your symptoms and insurance. Multilingual team available.',
    officeHours: 'Mon–Fri 09:00–18:00',
    treatmentFormat: 'hybrid',
    websiteUrl: 'https://ggznoordholland.nl',
    rating: 4.5,
    reviewCount: 241,
  },
  {
    id: 'p3',
    name: 'PsyQ Amsterdam',
    type: 'Specialized GGZ',
    city: 'Amsterdam',
    distance: '3.5 km',
    waitingTime: '8 weeks',
    specializations: ['Personality disorders', 'OCD', 'Anxiety disorders', 'ADHD'],
    languages: ['Dutch', 'English'],
    insurance: ['All major insurers'],
    studentExperience: false,
    onlineAvailable: false,
    acceptingPatients: true,
    description:
      'PsyQ is a national network of specialized mental healthcare centers offering treatment for complex mental health conditions. Known for their structured treatment programs.',
    address: 'Paasheuvelweg 25, 1105 BP Amsterdam',
    coordinates: { lat: 52.3086, lng: 4.9408 },
    specialists: ['Dr. Emma van der Berg', 'Dr. Thomas de Groot'],
    crisisPolicy: 'For crises, contact 113 Suicide Prevention (0800-0113) or call 112.',
    recommendationReason: 'Matches your insurance. Longer wait but specialized expertise.',
    officeHours: 'Mon–Thu 08:00–17:00, Fri 08:00–16:00',
    treatmentFormat: 'in-person',
    websiteUrl: 'https://psyq.nl',
    rating: 4.3,
    reviewCount: 178,
  },
  {
    id: 'p4',
    name: 'Centrum voor Angst en Stemming',
    type: 'Specialized Clinic',
    city: 'Amsterdam',
    distance: '4.1 km',
    waitingTime: '10 weeks',
    specializations: ['Anxiety', 'Mood disorders', 'Depression'],
    languages: ['Dutch'],
    insurance: ['CZ', 'Menzis'],
    studentExperience: false,
    onlineAvailable: true,
    acceptingPatients: false,
    description: 'Specialized center for anxiety and mood disorders with a focus on CBT.',
    address: 'Wibautstraat 150, 1091 GR Amsterdam',
    coordinates: { lat: 52.3542, lng: 4.9168 },
    specialists: ['Dr. Henk Vossen'],
    crisisPolicy: 'Call 112 for emergencies.',
    officeHours: 'Mon–Fri 09:00–17:00',
    treatmentFormat: 'in-person',
    websiteUrl: 'https://angststemming.nl',
    rating: 4.1,
    reviewCount: 89,
  },
  {
    id: 'p5',
    name: 'Mentaal Welzijn Centrum',
    type: 'GGZ',
    city: 'Amsterdam',
    distance: '0.8 km',
    waitingTime: '3 weeks',
    specializations: ['Stress', 'Burnout', 'Anxiety', 'Depression', 'Young adults', 'Students'],
    languages: ['Dutch', 'English', 'German'],
    insurance: ['Zilveren Kruis', 'VGZ', 'CZ', 'ONVZ'],
    studentExperience: true,
    onlineAvailable: true,
    acceptingPatients: true,
    description:
      'A modern mental wellness center focused on accessible, student-friendly care. Offers flexible scheduling including evenings and weekends. Known for short waiting lists and a warm, supportive environment.',
    address: 'Keizersgracht 440, 1016 GD Amsterdam',
    coordinates: { lat: 52.3612, lng: 4.8782 },
    specialists: ['Dr. Nadia Kuijpers', 'Dr. Lars van Dijk', 'Dr. Fatima Aziz'],
    crisisPolicy:
      '24/7 crisis line for registered patients. Emergency: 112. Crisis support: 0800-0113.',
    recommendationReason:
      'Closest to your location, shortest wait time, and extensive student experience.',
    officeHours: 'Mon–Fri 08:00–20:00, Sat 10:00–16:00',
    treatmentFormat: 'hybrid',
    websiteUrl: 'https://mentaalwelzijn.nl',
    rating: 4.8,
    reviewCount: 456,
  },
];

export const recommendedProviders = mockProviders.filter((p) => p.acceptingPatients).slice(0, 3);
