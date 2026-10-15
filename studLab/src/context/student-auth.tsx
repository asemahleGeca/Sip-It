import { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { supabase } from '../lib/supabaseconfig';
import { StudentProfileDetails } from '../lib/student-store';

type StudentAuthValue = {
	session: Session | null;
	pendingProfile: StudentProfileDetails | null;
	setPendingProfile: (profile: StudentProfileDetails | null) => void;
	loading: boolean;
	error: string | null;
	retry: () => void;
};

const StudentAuthContext = createContext<StudentAuthValue | null>(null);

export function StudentAuthProvider({ children }: PropsWithChildren) {
	const [session, setSession] = useState<Session | null>(null);
	const [pendingProfile, setPendingProfile] = useState<StudentProfileDetails | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [retryCount, setRetryCount] = useState(0);
	const retry = useCallback(() => setRetryCount((count) => count + 1), []);

	useEffect(() => {
		let active = true;
		let authEventReceived = false;
		const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
			authEventReceived = true;
			setSession(nextSession);
			if (!nextSession) setPendingProfile(null);
			setLoading(false);
			setError(null);
		});

		supabase.auth.getSession().then(({ data, error: sessionError }) => {
			if (!active) return;
			if (sessionError) {
				setError(sessionError.message);
			} else if (!authEventReceived) {
				setSession(data.session);
			}
			setLoading(false);
		}).catch((sessionError: unknown) => {
			if (!active) return;
			setError(sessionError instanceof Error ? sessionError.message : 'Could not restore your session.');
			setLoading(false);
		});

		return () => {
			active = false;
			subscription.unsubscribe();
		};
	}, [retryCount]);

	const value = useMemo(
		() => ({ session, pendingProfile, setPendingProfile, loading, error, retry }),
		[session, pendingProfile, loading, error, retry],
	);
	return <StudentAuthContext.Provider value={value}>{children}</StudentAuthContext.Provider>;
}

export function useStudentAuth() {
	const context = useContext(StudentAuthContext);
	if (!context) throw new Error('useStudentAuth must be used inside StudentAuthProvider.');
	return context;
}
