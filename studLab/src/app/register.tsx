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
import { BackButton } from '../components/back-button';
import { StudentIllustration } from '../components/student-illustration';
import { registerStudent } from '../lib/student-store';
import { supabase } from '../lib/supabaseconfig';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [busy, setBusy] = useState(false);

  const onRegister = async () => {
    if (!name.trim() || !surname.trim() || !email.trim() || !password || !confirmPassword || !cellphoneNumber.trim() ||
        !country.trim() || !dateOfBirth.trim() || !address.trim()) {
      Alert.alert('Missing details', 'Please complete every field.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match', 'Enter the same password in both password fields.');
      return;
    }
    setBusy(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const result = await registerStudent({
        name: name.trim(),
        surname: surname.trim(),
        email: cleanEmail,
        cellphoneNumber: cellphoneNumber.trim(),
        country: country.trim(),
        dateOfBirth: dateOfBirth.trim(),
        address: address.trim(),
        password,
      });

      if (!result.ok) {
        Alert.alert('Registration failed', result.message);
        return;
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (!session) {
        Alert.alert(
          'Registration successful',
          'Check your email to confirm your account. Once confirmed, log in to choose your course.',
          [{ text: 'Continue', onPress: () => router.replace('/login') }],
        );
      } else {
        Alert.alert('Registration successful', 'Your account is ready. Choose your course to continue.', [
          { text: 'Choose course', onPress: () => router.replace('/courses') },
        ]);
      }
    } catch (error) {
      Alert.alert('Registration failed', error instanceof Error ? error.message : 'Please try again.');
    } finally {
      setBusy(false);
    }
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
        <BackButton fallbackRoute="/" />
        <StudentIllustration />
        <Text style={styles.eyebrow}>LET'S GET YOU STARTED</Text>
        <Text style={styles.title}>Make room{"\n"}for what's next.</Text>
        <Text style={styles.subtitle}>Create your student account and choose a course that fits your goals.</Text>

        <Text style={styles.sectionLabel}>ABOUT YOU</Text>
        {field('First name', name, setName, { autoComplete: 'given-name' })}
        {field('Surname', surname, setSurname, { autoComplete: 'family-name' })}
        {field('Email address', email, setEmail, { autoCapitalize: 'none', keyboardType: 'email-address', autoComplete: 'email' })}
        <Text style={styles.sectionLabel}>SECURE YOUR ACCOUNT</Text>
        {field('Password', password, setPassword, { secureTextEntry: true, autoComplete: 'new-password' })}
        {field('Confirm password', confirmPassword, setConfirmPassword, { secureTextEntry: true, autoComplete: 'new-password' })}
        <Text style={styles.sectionLabel}>CONTACT DETAILS</Text>
        {field('Cellphone number', cellphoneNumber, setCellphoneNumber, { keyboardType: 'phone-pad' })}
        {field('Country', country, setCountry)}
        {field('Date of birth (YYYY-MM-DD)', dateOfBirth, setDateOfBirth)}
        {field('Address', address, setAddress, { multiline: true, numberOfLines: 2 })}

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
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 48 },
  eyebrow: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  title: { color: '#FFFFFF', fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { color: '#A7A7A1', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  sectionLabel: { color: GOLD, fontSize: 9, fontWeight: '800', letterSpacing: 1.4, marginTop: 10, marginBottom: 10 },
  input: { backgroundColor: '#161618', color: '#FFFFFF', borderRadius: 14, paddingHorizontal: 15, paddingVertical: 13, marginBottom: 10, borderWidth: 1, borderColor: '#2B2B2C', minHeight: 52 },
  btn: { backgroundColor: GOLD, paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 12, minHeight: 52, justifyContent: 'center' },
  btnText: { color: BG, fontWeight: '700', fontSize: 16 },
  link: { color: GOLD, textAlign: 'center', marginTop: 20, padding: 8, fontWeight: '600' },
});