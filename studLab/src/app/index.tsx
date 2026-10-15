import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components/back-button';
import { StudentIllustration } from '../components/student-illustration';
import { useStudentAuth } from '../context/student-auth';
import { getStudentById, logoutStudent, Student } from '../lib/student-store';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';
const CARD = '#161618';

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value || '-'}</Text>
    </View>
  );
}

export default function Index() {
  const router = useRouter();
  const { session } = useStudentAuth();
  const studentId = session?.user.id;
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(null);

    if (!studentId) {
      setStudent(null);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    getStudentById(studentId)
      .then((s) => {
        if (!active) return;
        setStudent(s);
        setLoading(false);
      })
      .catch((error: unknown) => {
        if (!active) return;
        setLoadError(error instanceof Error ? error.message : 'Could not load your student profile.');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [studentId, reloadCount]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={GOLD} />
      </View>
    );
  }

  if (!session) {
    return (
      <ScrollView contentContainerStyle={styles.landing}>
        <StudentIllustration />
        <Text style={styles.eyebrow}>YOUR NEXT CHAPTER STARTS HERE</Text>
        <Text style={styles.brand}>Learn something{"\n"}that moves you.</Text>
        <Text style={styles.tagline}>Find your course, build real skills, and make your next move with confidence.</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/register')}>
          <Text style={styles.primaryText}>Create your account  →</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/login')}>
          <Text style={styles.secondaryText}>I already have an account</Text>
        </TouchableOpacity>
        <Text style={styles.trustNote}>SHORT COURSES  ·  LEARN AT YOUR PACE</Text>
      </ScrollView>
    );
  }

  if (loadError) {
    return (
      <View style={styles.center}>
        <Text style={styles.heading}>Could not load your profile</Text>
        <Text style={styles.courseDesc}>{loadError}</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => setReloadCount((count) => count + 1)}>
          <Text style={styles.primaryText}>Try again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={async () => {
            try {
              await logoutStudent();
            } catch (error) {
              Alert.alert('Could not log out', error instanceof Error ? error.message : 'Please try again.');
            }
          }}
        >
          <Text style={styles.secondaryText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.center}>
        <Text style={styles.heading}>Finish setting up your profile</Text>
        <Text style={styles.courseDesc}>
          Your account is active, but your student details are missing. Add them once to continue to course selection.
        </Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.replace('/complete-profile')}>
          <Text style={styles.primaryText}>Complete my profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={async () => {
            try {
              await logoutStudent();
            } catch (error) {
              Alert.alert('Could not log out', error instanceof Error ? error.message : 'Please try again.');
            }
          }}
        >
          <Text style={styles.secondaryText}>Log out</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const course = student.course;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <BackButton fallbackRoute="/courses" label="Courses" />
      <View style={styles.topBar}>
        <View>
          <Text style={styles.eyebrow}>STUDENT SPACE</Text>
          <Text style={styles.topBarTitle}>Your learning</Text>
        </View>
        <View style={styles.avatar}><Text style={styles.avatarText}>{student.name.charAt(0).toUpperCase()}</Text></View>
      </View>

      <View style={styles.welcomeCard}>
        <Text style={styles.welcomeKicker}>GOOD TO HAVE YOU HERE</Text>
        <Text style={styles.heading}>Welcome,{"\n"}{student.name}.</Text>
        <Text style={styles.welcomeCopy}>Your next step is waiting for you.</Text>
      </View>

      <View style={styles.statRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{course?.modules.length ?? '—'}</Text>
          <Text style={styles.statLabel}>COURSE MODULES</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{course ? '01' : '00'}</Text>
          <Text style={styles.statLabel}>COURSES JOINED</Text>
        </View>
      </View>

      <Text style={styles.section}>YOUR DETAILS</Text>
      <View style={styles.card}>
        <Row label="Name" value={student.name} />
        <Row label="Surname" value={student.surname} />
        <Row label="Email" value={student.email} />
        <Row label="Cellphone" value={student.cellphoneNumber} />
        <Row label="Country" value={student.country} />
        <Row label="Date of birth" value={student.dateOfBirth} />
        <Row label="Address" value={student.address} />
        <Row label="Registered" value={new Date(student.createdAt).toLocaleDateString()} />
      </View>

      <Text style={styles.section}>YOUR LEARNING PATH</Text>
      {course ? (
        <View style={styles.courseCard}>
          <Text style={styles.courseKicker}>CURRENT COURSE</Text>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDesc}>{course.description}</Text>
          <View style={styles.courseMeta}>
            <Text style={styles.moduleCount}>{course.modules.length} MODULES</Text>
            <Text style={styles.moduleCount}>SELF-PACED</Text>
          </View>
          <TouchableOpacity style={styles.courseAction} onPress={() => router.push('/courses')}>
            <Text style={styles.courseActionText}>Explore other courses  →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.emptyCourse} onPress={() => router.push('/courses')}>
          <Text style={styles.emptyIcon}>＋</Text>
          <Text style={styles.emptyTitle}>Choose your first course</Text>
          <Text style={styles.courseDesc}>Pick a learning path and start building skills that matter.</Text>
          <Text style={styles.courseActionText}>Browse courses  →</Text>
        </TouchableOpacity>
      )}

      {course ? <Text style={styles.section}>UP NEXT IN YOUR COURSE</Text> : null}
      {course?.modules.map((module) => (
        <View key={module.id} style={[styles.card, { marginBottom: 10 }]}>
          <View style={styles.moduleRow}>
            <View style={styles.moduleBadge}><Text style={styles.moduleBadgeText}>{String(module.position).padStart(2, '0')}</Text></View>
            <View style={styles.moduleContent}>
              <Text style={styles.moduleNo}>MODULE {String(module.position).padStart(2, '0')}</Text>
              <Text style={styles.moduleTitle}>{module.title}</Text>
              <Text style={styles.courseDesc}>{module.description}</Text>
            </View>
            <Text style={styles.moduleArrow}>›</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          try {
            await logoutStudent();
            router.replace('/');
          } catch (error) {
            Alert.alert('Could not log out', error instanceof Error ? error.message : 'Please try again.');
          }
        }}
      >
        <Text style={styles.secondaryText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 48 },
  landing: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 28, paddingVertical: 30, backgroundColor: BG },
  brand: { color: '#FFFFFF', fontSize: 42, lineHeight: 48, fontWeight: '800', textAlign: 'center', letterSpacing: -1.5, marginTop: 10 },
  tagline: { color: '#A7A7A1', fontSize: 16, lineHeight: 24, textAlign: 'center', marginTop: 14, marginBottom: 34, maxWidth: 340 },
  primaryBtn: { backgroundColor: GOLD, paddingVertical: 16, borderRadius: 16, width: '100%', alignItems: 'center', minHeight: 56, justifyContent: 'center' },
  primaryText: { color: BG, fontWeight: '800', fontSize: 16 },
  secondaryBtn: { borderColor: '#343431', borderWidth: 1, paddingVertical: 15, borderRadius: 16, width: '100%', alignItems: 'center', marginTop: 12, minHeight: 54, justifyContent: 'center' },
  secondaryText: { color: '#E9E5DD', fontWeight: '600', fontSize: 15 },
  trustNote: { color: '#777773', fontSize: 10, letterSpacing: 1.3, fontWeight: '700', marginTop: 34, textAlign: 'center' },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 44, backgroundColor: BG },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 },
  eyebrow: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 8 },
  topBarTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  avatar: { width: 44, height: 44, borderRadius: 16, backgroundColor: '#29251D', borderWidth: 1, borderColor: '#4A3D27', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: GOLD, fontSize: 18, fontWeight: '800' },
  welcomeCard: { backgroundColor: '#211D16', borderRadius: 24, borderWidth: 1, borderColor: '#3D3425', padding: 22, overflow: 'hidden' },
  welcomeKicker: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginBottom: 14 },
  heading: { color: '#FFFFFF', fontSize: 32, lineHeight: 37, fontWeight: '800', letterSpacing: -0.8 },
  welcomeCopy: { color: '#C3BBAE', fontSize: 14, marginTop: 12 },
  statRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  statCard: { flex: 1, backgroundColor: CARD, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#252527' },
  statNumber: { color: GOLD, fontSize: 24, fontWeight: '800' },
  statLabel: { color: '#858580', fontSize: 9, letterSpacing: 1, fontWeight: '700', marginTop: 5 },
  section: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.5, marginTop: 28, marginBottom: 12 },
  card: { backgroundColor: CARD, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#252527' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: '#252527' },
  rowLabel: { color: '#8A8A8A', fontSize: 13 },
  rowValue: { color: '#FFFFFF', fontSize: 13, flexShrink: 1, textAlign: 'right', marginLeft: 16 },
  courseCard: { backgroundColor: CARD, borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#3D3425' },
  courseKicker: { color: GOLD, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginBottom: 12 },
  courseTitle: { color: '#FFFFFF', fontSize: 23, fontWeight: '800', marginBottom: 8 },
  courseDesc: { color: '#B5B5B5', fontSize: 13, lineHeight: 20 },
  courseMeta: { flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#33302B', marginTop: 18, paddingTop: 14 },
  moduleCount: { color: GOLD, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  moduleNo: { color: GOLD, fontSize: 9, fontWeight: '800', letterSpacing: 1.2 },
  moduleTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginVertical: 5 },
  courseAction: { alignSelf: 'flex-start', paddingTop: 16 },
  courseActionText: { color: GOLD, fontWeight: '700', fontSize: 14, marginTop: 12 },
  emptyCourse: { backgroundColor: CARD, borderRadius: 22, padding: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: '#5A4A2F' },
  emptyIcon: { color: GOLD, fontSize: 28, fontWeight: '400' },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 12 },
  moduleRow: { flexDirection: 'row', alignItems: 'center' },
  moduleBadge: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#29251D', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  moduleBadgeText: { color: GOLD, fontWeight: '800', fontSize: 13 },
  moduleContent: { flex: 1 },
  moduleArrow: { color: '#777773', fontSize: 24, marginLeft: 8 },
  logoutBtn: { borderColor: '#343431', borderWidth: 1, paddingVertical: 15, borderRadius: 16, alignItems: 'center', marginTop: 24, minHeight: 52, justifyContent: 'center' },
});