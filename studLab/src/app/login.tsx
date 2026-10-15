import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { hashPassword } from '../lib/hash';
import { loginStudent } from '../lib/student-store';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  const onLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing details', 'Please enter your email and password.');
      return;
    }
    setBusy(true);
    const passwordHash = await hashPassword(email, password);
    const student = loginStudent(email, passwordHash);
    setBusy(false);

    if (!student) {
      Alert.alert('Login failed', 'Incorrect email or password.');
      return;
    }
    router.replace({ pathname: '/', params: { studentId: student.id } });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.eyebrow}>COURSE HUB</Text>
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Log in to continue with your course.</Text>

        <TextInput
          style={styles.input}
          placeholder="Email address"
          placeholderTextColor="#777773"
          autoCapitalize="none"
          autoComplete="email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#777773"
          secureTextEntry
          autoComplete="current-password"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.btn} onPress={onLogin} disabled={busy}>
          {busy ? <ActivityIndicator color={BG} /> : <Text style={styles.btnText}>Log in</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/register')}>
          <Text style={styles.link}>New here? Create an account</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, justifyContent: 'center' },
  content: { padding: 24 },
  eyebrow: { color: GOLD, fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 12 },
  title: { color: '#FFFFFF', fontSize: 30, fontWeight: '700' },
  subtitle: { color: '#A7A7A1', fontSize: 14, marginTop: 8, marginBottom: 26 },
  input: { backgroundColor: '#161618', color: '#FFFFFF', borderRadius: 8, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#2B2B2C', minHeight: 50 },
  btn: { backgroundColor: GOLD, paddingVertical: 14, borderRadius: 8, alignItems: 'center', marginTop: 8, minHeight: 50, justifyContent: 'center' },
  btnText: { color: BG, fontWeight: '700', fontSize: 16 },
  link: { color: GOLD, textAlign: 'center', marginTop: 20, padding: 8 },
});