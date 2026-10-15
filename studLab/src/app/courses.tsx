import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components/back-button';
import { StudentIllustration } from '../components/student-illustration';
import { useStudentAuth } from '../context/student-auth';
import { COURSES, selectStudentCourse } from '../lib/student-store';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';

export default function Courses() {
  const router = useRouter();
  const { pendingProfile, setPendingProfile } = useStudentAuth();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const chooseCourse = async (courseId: string) => {
    if (selectedCourse) return;
    setErrorMessage('');
    setSelectedCourse(courseId);
    try {
      const result = await selectStudentCourse(courseId, pendingProfile);
      if (!result.ok) {
        setErrorMessage(`Could not choose this course: ${result.message}`);
        return;
      }
      setPendingProfile(null);
      router.replace('/');
    } catch (error) {
      setErrorMessage(`Could not choose this course: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setSelectedCourse(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <BackButton fallbackRoute="/complete-profile" />
      <Text style={styles.eyebrow}>A GOOD PLACE TO START</Text>
      <StudentIllustration />
      <Text style={styles.title}>Pick your next{"\n"}big thing.</Text>
      <Text style={styles.subtitle}>Choose a learning path that feels right. You can explore the modules before you begin.</Text>
      {pendingProfile ? (
        <Text style={styles.pendingNotice}>
          Your profile details will be saved together with your course choice.
        </Text>
      ) : null}
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

      {COURSES.map((course, index) => (
        <View key={course.id} style={styles.course}>
          <View style={styles.courseTop}>
            <View style={[styles.courseNumber, index === 1 && styles.courseNumberAlt, index === 2 && styles.courseNumberThird]}>
              <Text style={styles.courseNumberText}>0{index + 1}</Text>
            </View>
            <Text style={styles.moduleCount}>{course.modules.length} MODULES</Text>
          </View>
          <Text style={styles.courseTitle}>{course.title}</Text>
          <Text style={styles.description}>{course.description}</Text>
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>YOU'LL EXPLORE</Text>
            <Text style={styles.previewText}>{course.modules.slice(0, 2).map((module) => module.title).join('  ·  ')}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => chooseCourse(course.id)}
            disabled={selectedCourse !== null}
            accessibilityRole="button"
          >
            {selectedCourse === course.id ? <ActivityIndicator color={BG} /> : <Text style={styles.buttonText}>Choose this path  →</Text>}
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 22, paddingTop: 28, paddingBottom: 48, backgroundColor: BG },
  eyebrow: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 2 },
  title: { color: '#FFFFFF', fontSize: 34, lineHeight: 38, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { color: '#A7A7A1', fontSize: 14, lineHeight: 21, marginTop: 10, marginBottom: 24 },
  error: { color: '#F08D84', fontSize: 14, lineHeight: 20, backgroundColor: '#2A1717', borderRadius: 12, padding: 12, marginBottom: 16 },
  pendingNotice: { color: '#E6D6B4', fontSize: 13, lineHeight: 19, backgroundColor: '#29251D', borderRadius: 12, padding: 12, marginBottom: 16 },
  course: { backgroundColor: '#161618', borderRadius: 22, padding: 18, marginBottom: 14, borderWidth: 1, borderColor: '#2B2B2C' },
  courseTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  courseNumber: { width: 42, height: 42, borderRadius: 14, backgroundColor: '#29251D', alignItems: 'center', justifyContent: 'center' },
  courseNumberAlt: { backgroundColor: '#1F2925' },
  courseNumberThird: { backgroundColor: '#29212A' },
  courseNumberText: { color: GOLD, fontWeight: '800', fontSize: 14 },
  courseTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  description: { color: '#B5B5B5', fontSize: 13, lineHeight: 19, marginTop: 7 },
  preview: { backgroundColor: '#101012', borderRadius: 12, padding: 12, marginTop: 16 },
  previewLabel: { color: '#858580', fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  previewText: { color: '#D1CEC7', fontSize: 11, lineHeight: 16, marginTop: 6 },
  moduleCount: { color: GOLD, fontSize: 9, fontWeight: '800', letterSpacing: 1.1 },
  button: { backgroundColor: GOLD, paddingVertical: 13, borderRadius: 13, alignItems: 'center', marginTop: 14, minHeight: 48, justifyContent: 'center' },
  buttonText: { color: BG, fontWeight: '800', fontSize: 14 },
});