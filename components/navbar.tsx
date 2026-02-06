'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useQuery } from 'convex/react';
import { useRouter, useParams } from 'next/navigation';
import { useSidebar } from './ui/sidebar';
import { EllipsisVertical } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogTrigger } from './ui/dialog';
import { Popover, PopoverTrigger } from './ui/popover';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import Image from 'next/image';
import BoardOptions from '@/components/popovers/board-options';

export default function Navbar() {
	const { open } = useSidebar();
	const { theme } = useTheme();

	const router = useRouter();
	const params = useParams();

	const [mounted, setMounted] = useState(false);
	const [openBoardOptionsModal, setOpenBoardOptionsModal] = useState(false);

	const boards = useQuery(api.boards.getBoards);

	useEffect(() => {
		if (!boards) return;

		if (!params.slug && boards.length > 0) {
			router.push(`/boards/${boards[0].slug}`);
		}
	}, [boards, params, router]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			setMounted(true);
		}, 100);

		return () => clearTimeout(timeout);
	}, []);

	return (
		<header
			className={cn(
				`sticky top-0 z-20 bg-white py-5
			border-b border-b-lines border-solid px-6
			`,
			)}>
			<nav className='flex items-center justify-between'>
				<div className='flex items-center gap-4 sm:gap-8 self-stretch'>
					<div
						className={cn(
							`sm:pr-8 sm:border-r border-r-lines border-solid
						 h-full items-center justify-center sm:py-8.75 sm:hidden
						`,
							open && 'flex',
						)}>
						<Link href='/'>
							<svg
								width='24'
								height='25'
								viewBox='0 0 24 25'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'
								className='sm:hidden'>
								<rect width='6' height='25' rx='2' fill='#635FC7' />
								<rect
									opacity='0.75'
									x='9'
									width='6'
									height='25'
									rx='2'
									fill='#635FC7'
								/>
								<rect
									opacity='0.5'
									x='18'
									width='6'
									height='25'
									rx='2'
									fill='#635FC7'
								/>
							</svg>

							{mounted && (
								<Image
									src={`/logo${theme === 'dark' ? '-light' : ''}.png`}
									width={152.53}
									height={25.22}
									alt='kanban logo'
									className='hidden md:block'
								/>
							)}
						</Link>
					</div>

					<h1 className='text-h-xl text-black'>
						{boards?.length === 0
							? 'No Boards'
							: boards?.find((board) => board.slug === params.slug)?.name}
					</h1>
				</div>

				<div className='flex items-center gap-4 sm:gap-6'>
					<Dialog>
						<DialogTrigger asChild>
							<Button className=' h-8 sm:h-12 px-4.5 sm:px-6'>
								+ <span className='hidden sm:block'>Add New Task</span>
							</Button>
						</DialogTrigger>
					</Dialog>

					<Popover
						open={openBoardOptionsModal}
						onOpenChange={setOpenBoardOptionsModal}>
						<PopoverTrigger asChild>
							<button>
								<EllipsisVertical className='text-medium-grey' />
							</button>
						</PopoverTrigger>
						<BoardOptions onClose={() => setOpenBoardOptionsModal(false)} />
					</Popover>
				</div>
			</nav>
		</header>
	);
}
