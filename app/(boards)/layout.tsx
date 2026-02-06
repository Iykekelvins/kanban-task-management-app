import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

import BoardsLayoutWrapper from './boards-layout-wrapper';
import Navbar from '@/components/navbar';
import SidebarBtn from '@/components/sidebar-btn';

export default function BoardsLayout({ children }: { children: React.ReactNode }) {
	return (
		<BoardsLayoutWrapper>
			<SidebarProvider>
				<AppSidebar />
				<div className='w-full flex flex-col'>
					<Navbar />
					<main className='flex'>{children}</main>
					<SidebarBtn />
				</div>
			</SidebarProvider>
		</BoardsLayoutWrapper>
	);
}
