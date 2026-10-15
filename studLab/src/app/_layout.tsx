import { Stack } from 'expo-router';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StudentAuthProvider, useStudentAuth } from '../context/student-auth';

const BACKGROUND = '#0B0B0C';
const GOLD = '#C9A96A';

export default function RootLayout() {
	return (
		<StudentAuthProvider>
			<RootNavigator />
		</StudentAuthProvider>
	);
}

function RootNavigator() {
	const { session, loading, error, retry } = useStudentAuth();

	if (loading) {
		return (
			<View style={styles.center}>
				<ActivityIndicator color={GOLD} />
			</View>
		);
	}

	if (error) {
		return (
			<View style={styles.center}>
				<Text style={styles.errorTitle}>Unable to connect</Text>
				<Text style={styles.errorText}>{error}</Text>
				<TouchableOpacity style={styles.retryButton} onPress={retry}>
					<Text style={styles.retryText}>Try again</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: BACKGROUND },
				animation: 'fade_from_bottom',
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Protected guard={!session}>
				<Stack.Screen name="login" />
				<Stack.Screen name="register" />
			</Stack.Protected>
			<Stack.Protected guard={!!session}>
				<Stack.Screen name="complete-profile" />
		<Stack.Screen name="courses" />
		

			</Stack.Protected>
		</Stack>
	);
}

const styles = StyleSheet.create({
	center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: BACKGROUND },
	errorTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
	errorText: { color: '#A7A7A1', fontSize: 14, textAlign: 'center', lineHeight: 21 },
	retryButton: { marginTop: 20, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8, backgroundColor: GOLD },
	retryText: { color: BACKGROUND, fontWeight: '700' },
});
