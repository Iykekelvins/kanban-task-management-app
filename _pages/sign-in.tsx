'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { SignInButton } from '@clerk/nextjs';
import { Spinner } from '@/components/ui/spinner';

import Image from 'next/image';

export default function SignIn() {
	const [loading, setLoading] = useState(false);
	const [mounted, setMounted] = useState(false);

	const { theme } = useTheme();

	useEffect(() => {
		const timeout = setTimeout(() => {
			setMounted(true);
		}, 100);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<div className='min-h-screen flex-1 flex flex-col items-center justify-center gap-6'>
			{mounted && (
				<Image
					src={`/logo${theme === 'dark' ? '-light' : ''}.png`}
					width={152.53}
					height={25.22}
					alt='kanban logo'
				/>
			)}

			<SignInButton mode='modal' forceRedirectUrl='/'>
				<Button onClick={() => setLoading(true)} disabled={loading}>
					Sign in with Google
					{loading && <Spinner />}
				</Button>
			</SignInButton>
		</div>
	);
}
