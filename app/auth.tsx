import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { supabase } from '../lib/supabase';

const MINIMUM_AGE = 18;

function getAge(dob: string): number | null {
  const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dobRegex.test(dob)) return null;

  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function SignUpScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!fullName || !dob || !phone || !address || !email || !password) {
      Alert.alert('Missing info', 'Please fill in every field before signing up.');
      return;
    }

    const age = getAge(dob);

    if (age === null) {
      Alert.alert('Invalid date', 'Please enter your date of birth as YYYY-MM-DD.');
      return;
    }

    if (age < MINIMUM_AGE) {
      Alert.alert(
        'Age restriction',
        `You must be at least ${MINIMUM_AGE} years old to create a Sip It account.`
      );
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            date_of_birth: dob,
            phone_number: phone,
            address: address,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes('18')) {
          Alert.alert('Age restriction', `You must be at least ${MINIMUM_AGE} years old to create a Sip It account.`);
        } else {
          Alert.alert('Error', error.message);
        }
      } else {
        Alert.alert('Success', 'Check your email to confirm your account!');
        router.replace('/');
      }
    } catch (err: any) {
      Alert.alert('Unexpected Error', err.message || 'Something went wrong');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.ageNotice}>You must be 18 or older to sign up.</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#aaa"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Date of Birth (YYYY-MM-DD)"
        placeholderTextColor="#aaa"
        value={dob}
        onChangeText={setDob}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#aaa"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#aaa"
        value={address}
        onChangeText={setAddress}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
  },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  ageNotice: { fontSize: 13, color: '#FF7A5C', marginBottom: 22, fontWeight: '600' },
  input: { width: '100%', backgroundColor: '#333', color: '#fff', padding: 15, borderRadius: 10, marginBottom: 20 },
  button: { backgroundColor: '#ff6f61', paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, marginTop: 10 },
  buttonText: { fontSize: 18, color: '#fff', fontWeight: '600' },
});