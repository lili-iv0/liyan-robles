import facilityImg from '../assets/facility.jpeg';
import floodImg from '../assets/flood.png';
import wordBudImg from '../assets/wordBud.png';
import rawsImg from '../assets/RAWS.jpeg';
import trackerImg from '../assets/tracker.jpeg';

const projects = [
  {
    id: 'facility-reservation',
    video: '', // optional: a YouTube / Vimeo link, or a direct .mp4 / .webm URL (shown first in the gallery)
    role: 'UI/UX | Full-stack Developer',
    details:
      'Booking portal for campus rooms and halls with admin approval, a weekly calendar, check-in tracking, and printable slips.',
    title: 'Campus Facility Reservation System',
    description:
      'Booking portal for campus rooms and halls with admin approval, a weekly calendar, check-in tracking, and printable slips.',
    image: facilityImg,
    tags: ['Ongoing', 'Python', 'Django', 'Bootstrap', 'SQLite', 'Chart.js'],
    github: 'https://github.com/Misteaken-Tan/Facility_Reservation',
    demo: '',
    website: '',
    featured: true,
  },
  {
    id: 'alab-ready',
    video: '',
    role: 'UI/UX | Full-stack Developer',
    details:
      'An interactive disaster preparedness platform featuring five modules on earthquakes, common accidents, storm surges, and fire, with pre-tests, interactive lessons, quick checks, educational minigames, scenario-based post-tests, AI-generated summaries, teacher analytics, and collaborative module creation.',
    title: 'Alab Ready',
    description:
      'A gamified disaster preparedness learning platform for Bulacan State University NSTP students, featuring role-based access, XP and badge rewards, and assessment analytics.',
    image: floodImg,
    tags: ['React', 'Vite', 'HTML', 'CSS', 'JavaScript', 'Supabase', 'PWA'],
    github: '',
    demo: 'https://drive.google.com/file/d/1nmIBaMVuypTYcgm3FGesTclhwCNN0KBB/view?usp=sharing',
    website: '',
    featured: true,
  },
  {
    id: 'word-bud',
    video: '',
    role: 'UI/UX | Mobile App Developer',
    title: 'Word Bud',
    description:
      'An Android vocabulary learning app featuring interactive flashcards, quizzes, progress tracking, and achievement badges to make learning fun and engaging.',
    image: wordBudImg,
    tags: ['Java', 'Android Studio', 'Figma'],
    github: 'https://github.com/lili-iv0/WordBud',
    demo: '',
    website: '',
    featured: true,
  },
  {
    id: 'raws-game',
    video: '',
    role: 'Game Designer | Developer',
    title: 'Red Alert: Weeks of Survival',
    description:
      'A top-down survival RPG built in Unity where players prepare for a natural disaster, manage resources, craft tools, and make critical decisions to survive.',
    image: rawsImg,
    tags: ['Unity', 'C#'],
    github: 'https://github.com/lili-iv0/RAWS',
    demo: 'https://drive.google.com/file/d/1RtKDQIEYtiZxizNgxFo4dRZUe2Gn6Gek/view?usp=drive_link',
    website: '',
    featured: false,
  },
  {
    id: 'fitness-tracker',
    video: '',
    role: 'Full-stack Developer',
    title: 'Fitness Tracker',
    description:
      ' A web app for tracking student fitness progress, with progress charts for students and a class dashboard for teachers.',
    image: trackerImg,
    tags: ['PHP', 'mySQL', 'FileZilla', 'JavaScript', 'CSS', 'Chart.js'],
    github: 'https://github.com/lili-iv0/web-project',
    demo: '',
    website: 'https://fitness-tracker.infinityfreeapp.com/',
    featured: true,
  },
];

export default projects;
