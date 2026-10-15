export type CourseModule = {
  id: string;
  position: number;
  title: string;
  description: string;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  modules: CourseModule[];
};

export type Student = {
  id: string;
  name: string;
  surname: string;
  email: string;
  passwordHash: string;
  cellphoneNumber: string;
  country: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  course: Course;
};

type Registration = Omit<Student, 'id' | 'createdAt' | 'course'> & { courseId: string };

export const COURSES: Course[] = [
  {
    id: 'web-development',
    title: 'Web Development',
    description: 'Build responsive websites and interactive web experiences.',
    modules: [
      { id: 'web-1', position: 1, title: 'Web Foundations', description: 'Understand the web, browsers, and how websites are structured.' },
      { id: 'web-2', position: 2, title: 'HTML & CSS', description: 'Create accessible page structures and style responsive layouts.' },
      { id: 'web-3', position: 3, title: 'JavaScript Essentials', description: 'Add logic, events, and dynamic behaviour to web pages.' },
      { id: 'web-4', position: 4, title: 'Build & Publish', description: 'Bring the skills together in a finished website project.' },
    ],
  },
  {
    id: 'data-analytics',
    title: 'Data Analytics',
    description: 'Turn raw information into clear findings and useful decisions.',
    modules: [
      { id: 'data-1', position: 1, title: 'Data Fundamentals', description: 'Learn data types, quality, and the analytics process.' },
      { id: 'data-2', position: 2, title: 'Spreadsheets & SQL', description: 'Organize, query, and prepare data for analysis.' },
      { id: 'data-3', position: 3, title: 'Analysis & Visualisation', description: 'Find patterns and communicate results with effective charts.' },
      { id: 'data-4', position: 4, title: 'Analytics Project', description: 'Apply the complete workflow to a practical dataset.' },
    ],
  },
  {
    id: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Plan campaigns, reach the right audience, and measure results.',
    modules: [
      { id: 'marketing-1', position: 1, title: 'Marketing Fundamentals', description: 'Define audiences, goals, and a clear value proposition.' },
      { id: 'marketing-2', position: 2, title: 'Content & Social Media', description: 'Create content and plan an effective social presence.' },
      { id: 'marketing-3', position: 3, title: 'Search & Campaigns', description: 'Explore search visibility and paid campaign planning.' },
      { id: 'marketing-4', position: 4, title: 'Measurement & Strategy', description: 'Use campaign results to improve a complete marketing plan.' },
    ],
  },
];

const students: Student[] = [];

export function registerStudent(registration: Registration): { ok: true } | { ok: false; message: string } {
  if (students.some((student) => student.email === registration.email)) {
    return { ok: false, message: 'That email is already registered.' };
  }

  const course = COURSES.find((option) => option.id === registration.courseId);
  if (!course) {
    return { ok: false, message: 'Please choose one of the available courses.' };
  }

  const { courseId, ...studentData } = registration;
  students.push({
    ...studentData,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    createdAt: new Date().toISOString(),
    course,
  });
  return { ok: true };
}

export function loginStudent(email: string, passwordHash: string): Student | null {
  const normalizedEmail = email.trim().toLowerCase();
  return students.find((student) => student.email === normalizedEmail && student.passwordHash === passwordHash) ?? null;
}

export function getStudentById(id: string | undefined): Student | null {
  if (!id) return null;
  return students.find((student) => student.id === id) ?? null;
}