'use client';

import { useStoreUserEffect } from '@/hooks/useStoreUserEffect';
import { Spinner } from '@/components/ui/spinner';

export default function BoardsLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isLoading } = useStoreUserEffect();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center min-h-screen'>
				<Spinner className='bg-background' />
			</div>
		);
	}

	return <>{children}</>;
}
