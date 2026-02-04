import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { ThemeProvider } from '@/providers/theme-provider';
import { Toaster } from 'sonner';

import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
	variable: '--font-plus-jakarta-sans',
	subsets: ['latin'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		default: 'Kanban - Task Management App',
		template: '%s | Kanban',
	},
	description:
		'A simple and efficient Kanban task management application to organize your workflow and boost productivity.',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en' suppressHydrationWarning>
			<body className={`${plusJakartaSans.variable} antialiased`}>
				<ThemeProvider
					attribute='class'
					defaultTheme='light'
					enableSystem
					disableTransitionOnChange>
					{children}
					<Toaster position='bottom-center' richColors theme='dark' />
				</ThemeProvider>
			</body>
		</html>
	);
}
