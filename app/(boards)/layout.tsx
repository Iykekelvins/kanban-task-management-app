import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

import Navbar from '@/components/navbar';

export default function BoardsLayout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<div className='w-full flex flex-col'>
				<Navbar />
				<main>{children}</main>
			</div>
		</SidebarProvider>
	);
}
