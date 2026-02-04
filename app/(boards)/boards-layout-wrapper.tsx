'use client';

import { useStoreUserEffect } from '@/hooks/useStoreUserEffect';

export default function BoardsLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const { isLoading } = useStoreUserEffect();
	if (isLoading) {
		return null;
	}

	return <>{children}</>;
}
