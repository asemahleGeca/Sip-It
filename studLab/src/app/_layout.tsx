import { Stack } from 'expo-router';

const BACKGROUND = '#0B0B0C';

export default function RootLayout() {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: BACKGROUND },
				animation: 'fade_from_bottom',
			}}
		>
			<Stack.Screen name="index" />
			<Stack.Screen name="login" />
			<Stack.Screen name="register" />
		</Stack>
	);
}
