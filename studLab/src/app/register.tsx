import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { hashPassword } from '../lib/hash';
import { COURSES, registerStudent } from '../lib/student-store';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';

export default function Register() {
  const router = useRouter();
  const [courseId, setCourseId] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  const onRegister = async () => {
    if (!name.trim() || !surname.trim() || !email.trim() || !password || !cellphoneNumber.trim() ||
        !country.trim() || !dateOfBirth.trim() || !address.trim()) {
      Alert.alert('Missing details', 'Please complete every field.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Password too short', 'Use at least 6 characters.');
      return;
    }
    if (!courseId) {
      Alert.alert('Choose a course', 'Select the course you would like to study.');
      return;
    }

    setBusy(true);
    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await hashPassword(cleanEmail, password);
    const result = registerStudent({
      name: name.trim(),
      surname: surname.trim(),
      email: cleanEmail,
      passwordHash,
      cellphoneNumber: cellphoneNumber.trim(),
      country: country.trim(),
      dateOfBirth: dateOfBirth.trim(),
      address: address.trim(),
      courseId,
    });
    setBusy(false);

    if (!result.ok) {
      Alert.alert('Registration failed', result.message);
      return;
    }
    Alert.alert('Account created', 'You can now log in with your email and password.', [
      { text: 'Continue', onPress: () => router.replace('/login') },
    ]);
  };

  const field = (
    placeholder: string,
    value: string,
    setter: (nextValue: string) => void,
    extra: object = {},
  ) => (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="#777773"
      value={value}
      onChangeText={setter}
      {...extra}
    />
  );

  return (
    <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.eyebrow}>COURSE HUB / ENROLMENT</Text>
        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Your details stay connected to the course you choose.</Text>

        {field('First name', name, setName, { autoComplete: 'given-name' })}
        {field('Surname', surname, setSurname, { autoComplete: 'family-name' })}
        {field('Email address', email, setEmail, { autoCapitalize: 'none', keyboardType: 'email-address', autoComplete: 'email' })}
        {field('Password (at least 6 characters)', password, setPassword, { secureTextEntry: true, autoComplete: 'new-password' })}
        {field('Cellphone number', cellphoneNumber, setCellphoneNumber, { keyboardType: 'phone-pad' })}
        {field('Country', country, setCountry)}
        {field('Date of birth (YYYY-MM-DD)', dateOfBirth, setDateOfBirth)}
        {field('Address', address, setAddress, { multiline: true, numberOfLines: 2 })}

        <Text style={styles.section}>Choose one course</Text>
        {COURSES.map((course) => {
          const selected = courseId === course.id;
          return (
            <TouchableOpacity
              key={course.id}
              style={[styles.course, selected && styles.courseSelected]}
              onPress={() => setCourseId(course.id)}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
            >
              <View style={styles.courseHeading}>
                <Text style={[styles.courseTitle, selected && styles.selectedText]}>{course.title}</Text>
                <View style={[styles.radio, selected && styles.radioSelected]}>
                  {selected && <View style={styles.radioDot} />}
                </View>
              </View>
              <Text style={styles.courseDesc}>{course.description}</Text>
              <Text style={styles.moduleCount}>{course.modules.length} MODULES</Text>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity style={styles.btn} onPress={onRegister} disabled={busy}>
          {busy ? <ActivityIndicator color={BG} /> : <Text style={styles.btnText}>Register</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Already registered? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: BG },
  container: { flexGrow: 1, padding: 24, paddingTop: 42, paddingBottom: 48 },
  eyebrow: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  title: { color: '#FFFFFF', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#A7A7A1', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  input: { backgroundColor: '#161618', color: '#FFFFFF', borderRadius: 8, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#2B2B2C', minHeight: 50 },
  section: { color: GOLD, fontSize: 12, fontWeight: '700', letterSpacing: 1.3, textTransform: 'uppercase', marginTop: 18, marginBottom: 10 },
  course: { backgroundColor: '#161618', borderRadius: 8, padding: 16, marginBottom: 10, borderWidth: 1, borderColor: '#2B2B2C' },
  courseSelected: { borderColor: GOLD },
  courseHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  courseTitle: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', flex: 1 },
  selectedText: { color: GOLD },
  courseDesc: { color: '#B5B5B5', fontSize: 13, lineHeight: 19, marginTop: 7 },
  moduleCount: { color: '#858580', fontSize: 10, fontWeight: '700', letterSpacing: 1.1, marginTop: 12 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, borderColor: '#777773', alignItems: 'center', justifyContent: 'center' },
  radioSelected: { borderColor: GOLD },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: GOLD },
  btn: { backgroundColor: GOLD, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 12, minHeight: 50, justifyContent: 'center' },
  btnText: { color: BG, fontWeight: '700', fontSize: 16 },
  link: { color: GOLD, textAlign: 'center', marginTop: 20, padding: 8 },
});