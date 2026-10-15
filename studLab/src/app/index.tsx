import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getStudentById, Student } from '../lib/student-store';

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
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  const [student, setStudent] = useState<Student | null>(() => getStudentById(studentId));

  useEffect(() => {
    setStudent(getStudentById(studentId));
  }, [studentId]);

  if (!studentId || !student) {
    return (
      <View style={styles.center}>
        <Text style={styles.brand}>Course Hub</Text>
        <Text style={styles.tagline}>Register and start learning today</Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/register')}>
          <Text style={styles.primaryText}>Register</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.push('/login')}>
          <Text style={styles.secondaryText}>Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const course = student.course;

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.eyebrow}>STUDENT DASHBOARD</Text>
      <Text style={styles.heading}>Welcome, {student.name}</Text>

      <Text style={styles.section}>Student details</Text>
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

      <Text style={styles.section}>Your course</Text>
      {course ? (
        <View style={styles.card}>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.courseDesc}>{course.description}</Text>
          <Text style={styles.moduleCount}>{course.modules.length} MODULES</Text>
        </View>
      ) : (
        <Text style={styles.courseDesc}>No course is connected to this student.</Text>
      )}

      <Text style={styles.section}>Modules</Text>
      {course.modules.map((module) => (
        <View key={module.id} style={[styles.card, { marginBottom: 10 }]}>
          <Text style={styles.moduleNo}>MODULE {String(module.position).padStart(2, '0')}</Text>
          <Text style={styles.moduleTitle}>{module.title}</Text>
          <Text style={styles.courseDesc}>{module.description}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.secondaryBtn} onPress={() => router.replace('/')}>
        <Text style={styles.secondaryText}>Log out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, backgroundColor: BG, alignItems: 'center', justifyContent: 'center', padding: 24 },
  brand: { color: GOLD, fontSize: 34, fontWeight: '700' },
  tagline: { color: '#A7A7A1', fontSize: 15, marginTop: 8, marginBottom: 40 },
  primaryBtn: { backgroundColor: GOLD, paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', minHeight: 50, justifyContent: 'center' },
  primaryText: { color: BG, fontWeight: '700', fontSize: 16 },
  secondaryBtn: { borderColor: GOLD, borderWidth: 1, paddingVertical: 14, borderRadius: 8, width: '100%', alignItems: 'center', marginTop: 12, minHeight: 50, justifyContent: 'center' },
  secondaryText: { color: GOLD, fontWeight: '600', fontSize: 16 },
  scroll: { flexGrow: 1, padding: 20, paddingTop: 42, paddingBottom: 40, backgroundColor: BG },
  eyebrow: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 10 },
  heading: { color: '#FFFFFF', fontSize: 26, fontWeight: '700' },
  section: { color: GOLD, fontSize: 12, fontWeight: '700', letterSpacing: 1.3, marginTop: 24, marginBottom: 10, textTransform: 'uppercase' },
  card: { backgroundColor: CARD, borderRadius: 8, padding: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: '#8A8A8A', fontSize: 14 },
  rowValue: { color: '#FFFFFF', fontSize: 14, flexShrink: 1, textAlign: 'right', marginLeft: 16 },
  courseTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  courseDesc: { color: '#B5B5B5', fontSize: 14, lineHeight: 20 },
  moduleCount: { color: GOLD, fontSize: 10, fontWeight: '700', letterSpacing: 1.2, marginTop: 14 },
  moduleNo: { color: GOLD, fontSize: 10, fontWeight: '700', letterSpacing: 1.3 },
  moduleTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginVertical: 4 },
});