import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { BackButton } from '../components/back-button';
import { StudentIllustration } from '../components/student-illustration';
import { loginStudent } from '../lib/student-store';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    if (busy) return;
    setError('');

    // Must match however register.tsx normalizes the email before hashing
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setBusy(true);
    try {
      const student = await loginStudent(cleanEmail, password);
      router.replace(student.course ? '/' : '/courses');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <BackButton fallbackRoute="/" />
          <StudentIllustration />
          <Text style={styles.eyebrow}>YOUR STUDENT SPACE</Text>
          <Text style={styles.title}>Good to see{"\n"}you again.</Text>
          <Text style={styles.subtitle}>Log in and pick up where your learning left off.</Text>

          <TextInput
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#777773"
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              if (error) setError('');
            }}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#777773"
            secureTextEntry
            autoComplete="current-password"
            value={password}
            onChangeText={(t) => {
              setPassword(t);
              if (error) setError('');
            }}
            onSubmitEditing={onLogin}
            returnKeyType="go"
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={[styles.btn, busy && styles.btnDisabled]} onPress={onLogin} disabled={busy}>
            {busy ? <ActivityIndicator color={BG} /> : <Text style={styles.btnText}>Log in</Text>}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.replace('/register')}>
            <Text style={styles.link}>New here? Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scrollContent: { flexGrow: 1, justifyContent: 'center' },
  content: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 30 },
  eyebrow: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  title: { color: '#FFFFFF', fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { color: '#A7A7A1', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  input: { backgroundColor: '#161618', color: '#FFFFFF', borderRadius: 14, paddingHorizontal: 15, paddingVertical: 13, marginBottom: 12, borderWidth: 1, borderColor: '#2B2B2C', minHeight: 52 },
  error: { color: '#F08D84', fontSize: 14, marginBottom: 4 },
  btn: { backgroundColor: GOLD, paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 8, minHeight: 52, justifyContent: 'center' },
  btnDisabled: { opacity: 0.7 },
  btnText: { color: BG, fontWeight: '700', fontSize: 16 },
  link: { color: GOLD, textAlign: 'center', marginTop: 20, padding: 8, fontWeight: '600' },
});