const profile = {
  name: 'Lee Ann Robles',
  title: 'IT Web and Mobile Developer',
  tagline:
    'I build web applications with Django and React, with a focus on clear interfaces, clean data models, and code that is easy to maintain.',

  email: 'leeann.robles1804@gmail.com',
  github: 'https://github.com/lili-iv0',
  linkedin: 'https://www.linkedin.com/in/liyan-robles',
  resumeUrl: 'https://drive.google.com/file/d/1tYHC3JudxMtKNYoZdvvdZXnO7qMf7QW5/view?usp=sharing',

  web3formsKey: 'eeb81e9d-5832-44ca-b595-67a505fa05b8',
  formspreeId: 'https://formspree.io/f/xdeajdpe',

  stack: ['React', 'Javascript','Supabase'],

  now: [
    { label: 'Building', value: 'A reservation system with Django and Bootstrap' },
    { label: 'Learning', value: 'Python and backend development' },
    { label: 'Availability', value: 'Open to internships and freelance work', open: true },
  ],

  bio: [
    'I’m an IT student specializing in web and mobile development. I enjoy creating applications that solve real-world problems and make everyday tasks easier. I work with JavaScript, React, Node.js, Express, Django, Supabase, Java, and Firebase, and I’m always looking for opportunities to learn and improve my skills as a developer.',
  ],

skills: [
  { group: 'Front end', items: ['HTML', 'CSS', 'JavaScript', 'React'] },
  { group: 'Back end', items: ['Node.js', 'Express.js', 'Django', 'REST APIs'] },
  { group: 'Mobile', items: ['Java', 'Android Studio', 'Firebase', 'Capacitor'] },
  { group: 'Databases', items: ['Supabase', 'Firebase', 'MySQL'] },
  { group: 'Tools', items: ['Git', 'GitHub', 'VS Code', 'Android Studio', 'Vercel', 'Cloudflare Pages'] },
],

  timeline: [
    {
      when: '2023 – Present',
      title: 'BS in Information Technology',
      place: 'Bulacan State University – Malolos',
      note: 'Focus on web and mobile development, databases, and software engineering.',
    },
    {
      when: '2026',
      title: 'Capstone project',
      place: 'Alab Ready - A gamified learning system',
      note: 'A gamified disaster preparedness platform built for Bulacan State University NSTP students. Features role-based dashboards for students, teachers, and admins, interactive modules, mini-games, XP and badges, and full assessment analytics with Excel export.',
    },
  ],
};

export default profile;
