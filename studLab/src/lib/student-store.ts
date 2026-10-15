import { supabase } from './supabaseconfig';

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
  cellphoneNumber: string;
  country: string;
  dateOfBirth: string;
  address: string;
  createdAt: string;
  course: Course | null;
};

export type Registration = Omit<Student, 'id' | 'createdAt' | 'course'> & {
  password: string;
};

export type StudentProfileDetails = Pick<
  Student,
  'name' | 'surname' | 'cellphoneNumber' | 'country' | 'dateOfBirth' | 'address'
>;

type Result = { ok: true } | { ok: false; message: string };

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

export async function registerStudent(r: Registration): Promise<Result> {
  const { data, error } = await supabase.auth.signUp({
    email: r.email.trim().toLowerCase(),
    password: r.password,
    options: {
      data: {
        name: r.name,
        surname: r.surname,
        cellphone_number: r.cellphoneNumber,
        country: r.country,
        date_of_birth: r.dateOfBirth,
        address: r.address,
      },
    },
  });
  if (error) {
    if (error.code === 'user_already_exists') {
      return { ok: false, message: 'An account with this email already exists. Please log in instead.' };
    }
    return { ok: false, message: error.message };
  }
  if (!data.user) {
    return { ok: false, message: 'Registration failed. Please try again.' };
  }
  if (data.user.identities?.length === 0) {
    return { ok: false, message: 'An account with this email already exists. Please log in instead.' };
  }

  if (data.session) {
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: data.user.id,
      name: r.name.trim(),
      surname: r.surname.trim(),
      cellphone_number: r.cellphoneNumber.trim(),
      country: r.country.trim(),
      date_of_birth: r.dateOfBirth.trim(),
      address: r.address.trim(),
    }, { onConflict: 'id' });

    if (profileError) {
      return { ok: false, message: `Your account was created, but your student details could not be saved: ${profileError.message}` };
    }
  }

  return { ok: true };
}

export async function loginStudent(email: string, password: string): Promise<Student> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  });
  if (error) throw error;
  if (!data.user) throw new Error('Login did not return an authenticated student.');
  const student = await getStudentById(data.user.id);
  if (!student) throw new Error('Your student profile could not be found. Please contact support.');
  return student;
}

export async function selectStudentCourse(
  courseId: string,
  profile?: StudentProfileDetails | null,
): Promise<Result> {
  if (!COURSES.some((course) => course.id === courseId)) {
    return { ok: false, message: 'Please choose one of the available courses.' };
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) return { ok: false, message: userError.message };
  if (!user) return { ok: false, message: 'Please log in again to choose a course.' };

  const profileData = profile
    ? {
        name: profile.name.trim(),
        surname: profile.surname.trim(),
        cellphone_number: profile.cellphoneNumber.trim(),
        country: profile.country.trim(),
        date_of_birth: profile.dateOfBirth.trim(),
        address: profile.address.trim(),
      }
    : {};
  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, ...profileData, course_id: courseId }, { onConflict: 'id' });
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function getStudentById(id: string | undefined): Promise<Student | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user || (id !== undefined && id !== user.id)) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();
  if (profileError) throw profileError;
  if (!profile) return null;

  const course = COURSES.find((c) => c.id === profile.course_id);
  return {
    id: profile.id,
    name: profile.name,
    surname: profile.surname,
    email: user.email ?? '',
    cellphoneNumber: profile.cellphone_number,
    country: profile.country,
    dateOfBirth: profile.date_of_birth,
    address: profile.address,
    createdAt: profile.created_at,
    course: course ?? null,
  };
}

export async function logoutStudent() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}