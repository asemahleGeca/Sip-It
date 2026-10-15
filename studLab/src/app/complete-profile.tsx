import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { BackButton } from '../components/back-button';
import { useStudentAuth } from '../context/student-auth';

const GOLD = '#C9A96A';
const BG = '#0B0B0C';

export default function CompleteProfile() {
  const router = useRouter();
  const { setPendingProfile } = useStudentAuth();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [cellphoneNumber, setCellphoneNumber] = useState('');
  const [country, setCountry] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const completeProfile = () => {
    setErrorMessage('');
    if (!name.trim() || !surname.trim() || !cellphoneNumber.trim() || !country.trim() ||
        !dateOfBirth.trim() || !address.trim()) {
      setErrorMessage('Please complete every field before continuing.');
      return;
    }

    const details = { name, surname, cellphoneNumber, country, dateOfBirth, address };
    setPendingProfile(details);
    router.replace('/courses');
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
        <Text style={styles.eyebrow}>ONE LAST STEP</Text>
        <Text style={styles.title}>Complete your student profile</Text>
        <Text style={styles.subtitle}>Add your details, then choose a course. We’ll save everything together when you choose.</Text>

        {field('First name', name, (value) => { setName(value); setErrorMessage(''); }, { autoComplete: 'given-name' })}
        {field('Surname', surname, (value) => { setSurname(value); setErrorMessage(''); }, { autoComplete: 'family-name' })}
        {field('Cellphone number', cellphoneNumber, (value) => { setCellphoneNumber(value); setErrorMessage(''); }, { keyboardType: 'phone-pad' })}
        {field('Country', country, (value) => { setCountry(value); setErrorMessage(''); })}
        {field('Date of birth (YYYY-MM-DD)', dateOfBirth, (value) => { setDateOfBirth(value); setErrorMessage(''); })}
        {field('Address', address, (value) => { setAddress(value); setErrorMessage(''); }, { multiline: true, numberOfLines: 2 })}

        {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={completeProfile}>
          <Text style={styles.buttonText}>Continue to choose a course</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: { flex: 1, backgroundColor: BG },
  container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 48, paddingBottom: 48 },
  eyebrow: { color: GOLD, fontSize: 10, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  title: { color: '#FFFFFF', fontSize: 30, lineHeight: 36, fontWeight: '800' },
  subtitle: { color: '#A7A7A1', fontSize: 14, lineHeight: 21, marginTop: 8, marginBottom: 24 },
  input: { backgroundColor: '#161618', color: '#FFFFFF', borderRadius: 14, paddingHorizontal: 15, paddingVertical: 13, marginBottom: 10, borderWidth: 1, borderColor: '#2B2B2C', minHeight: 52 },
  error: { color: '#F08D84', fontSize: 14, lineHeight: 20, marginTop: 4, marginBottom: 8 },
  button: { backgroundColor: GOLD, paddingVertical: 15, borderRadius: 14, alignItems: 'center', marginTop: 12, minHeight: 52, justifyContent: 'center' },
  buttonText: { color: BG, fontWeight: '800', fontSize: 15 },
});
