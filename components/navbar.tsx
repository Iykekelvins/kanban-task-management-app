'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useQuery } from 'convex/react';
import { useRouter, useParams } from 'next/navigation';
import { useSidebar } from './ui/sidebar';
import { ChevronDown, EllipsisVertical, LogOutIcon } from 'lucide-react';
import { Button } from './ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from './ui/dialog';
import { Popover, PopoverTrigger } from './ui/popover';
import { Switch } from './ui/switch';
import { SignOutButton } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';
import { cn } from '@/lib/utils';

import Link from 'next/link';
import Image from 'next/image';
import BoardOptions from '@/components/popovers/board-options';
import NewTask from './modals/new-task';
import NewBoard from './modals/new-board';

export default function Navbar() {
	const { open } = useSidebar();
	const { theme, setTheme } = useTheme();

	const router = useRouter();
	const params = useParams();
	const boardSlug = params.slug as string;

	const [mounted, setMounted] = useState(false);
	const [openMobileModal, setOpenMobileModal] = useState(false);
	const [openBoardOptionsModal, setOpenBoardOptionsModal] = useState(false);
	const [openNewTaskModal, setOpenNewTaskModal] = useState(false);
	const [openNewBoardModal, setOpenNewBoardModal] = useState(false);

	const boards = useQuery(api.boards.getBoards);
	const board = useQuery(api.boards.getBoard, {
		slug: boardSlug || '',
	});

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

					{boards?.length === 0 ? (
						<h1 className='text-h-l sm:text-h-xl text-black'>No Boards</h1>
					) : (
						<>
							<span className='hidden sm:block'>
								{boards?.find((board) => board.slug === params.slug)?.name}
							</span>
						</>
					)}
					<Dialog open={openMobileModal} onOpenChange={setOpenMobileModal}>
						<DialogTrigger asChild className='sm:hidden'>
							<button className='flex items-center gap-2'>
								{boards?.find((board) => board.slug === params.slug)?.name}
								<ChevronDown
									className={cn(
										'text-purple size-6 transition-transform duration-300 ease-in-out',
										openMobileModal && '-rotate-180',
									)}
								/>
							</button>
						</DialogTrigger>
						<DialogContent className='w-[75%]'>
							<DialogTitle className='text-b-m text-medium-grey px-8 -ml-6'>
								ALL BOARDS ({!boards ? '...' : boards?.length})
							</DialogTitle>
							<ul className='-ml-6 mt-2'>
								{boards?.map((board) => (
									<li key={board?._id}>
										<Link
											href={`/boards/${board?.slug}`}
											className={cn(
												'flex items-center gap-4 py-3.5 pl-8 text-h-m text-medium-grey',
												'transition-all duration-300 ease-in-out',
												'rounded-r-full',
												boardSlug === board.slug && 'bg-purple text-[#fff]',
												boardSlug !== board.slug &&
													'hover:bg-purple/10 hover:text-purple dark:hover:bg-[#fff]',
											)}
											onClick={() => setOpenMobileModal(false)}>
											<svg
												width='16'
												height='16'
												viewBox='0 0 16 16'
												fill='none'
												xmlns='http://www.w3.org/2000/svg'>
												<path
													fillRule='evenodd'
													clipRule='evenodd'
													d='M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z'
													fill={boardSlug === board.slug ? 'white' : '#828FA3'}
												/>
											</svg>
											<span>{board?.name}</span>
										</Link>
									</li>
								))}
							</ul>
							<DialogDescription hidden />

							<Dialog open={openNewBoardModal} onOpenChange={setOpenNewBoardModal}>
								<DialogTrigger asChild>
									<button className='flex items-center gap-4 pl-2 mt-1.75'>
										<svg
											width='16'
											height='16'
											viewBox='0 0 16 16'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'>
											<path
												fillRule='evenodd'
												clipRule='evenodd'
												d='M0.846133 0.846133C0.304363 1.3879 0 2.12271 0 2.88889V13.1111C0 13.8773 0.304363 14.6121 0.846133 15.1538C1.3879 15.6957 2.12271 16 2.88889 16H13.1111C13.8773 16 14.6121 15.6957 15.1538 15.1538C15.6957 14.6121 16 13.8773 16 13.1111V2.88889C16 2.12271 15.6957 1.3879 15.1538 0.846133C14.6121 0.304363 13.8773 0 13.1111 0H2.88889C2.12271 0 1.3879 0.304363 0.846133 0.846133ZM1.33333 13.1111V8.44448H9.77781V14.6667H2.88889C2.03022 14.6667 1.33333 13.9698 1.33333 13.1111ZM9.77781 7.11111V1.33333H2.88889C2.47633 1.33333 2.08067 1.49723 1.78895 1.78895C1.49723 2.08067 1.33333 2.47633 1.33333 2.88889V7.11111H9.77781ZM11.1111 5.77778H14.6667V10.2222H11.1111V5.77778ZM14.6667 11.5555H11.1111V14.6667H13.1111C13.5236 14.6667 13.9194 14.5028 14.2111 14.2111C14.5028 13.9194 14.6667 13.5236 14.6667 13.1111V11.5555ZM14.6667 2.88889V4.44445H11.1111V1.33333H13.1111C13.5236 1.33333 13.9194 1.49723 14.2111 1.78895C14.5028 2.08067 14.6667 2.47633 14.6667 2.88889Z'
												fill='#635FC7'
											/>
										</svg>
										<span className='text-purple text-h-m'>+ Create New Board</span>
									</button>
								</DialogTrigger>
								<NewBoard
									onClose={() => {
										setOpenNewBoardModal(false);
										setOpenMobileModal(false);
									}}
								/>
							</Dialog>

							<div
								className='bg-background rounded-md flex items-center 
											justify-center gap-6 py-3.5 mt-4'>
								<svg
									width='19'
									height='19'
									viewBox='0 0 19 19'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M9.75589 0.244082C9.59969 0.087798 9.38769 0 9.16667 0C8.94566 0 8.73369 0.087798 8.57741 0.244082C8.42113 0.400362 8.33334 0.612322 8.33334 0.833332V1.66666C8.33334 1.88768 8.42113 2.09964 8.57741 2.25592C8.73369 2.4122 8.94566 2.5 9.16667 2.5C9.38769 2.5 9.59969 2.4122 9.75589 2.25592C9.91219 2.09964 9.99999 1.88768 9.99999 1.66666V0.833332C9.99999 0.612322 9.91219 0.400362 9.75589 0.244082ZM2.5 1.66684C2.27903 1.66684 2.06711 1.75461 1.91084 1.91083C1.75461 2.0671 1.66685 2.27903 1.66685 2.5C1.66685 2.72097 1.75461 2.93289 1.91084 3.08916L3.16084 4.33916C3.318 4.49096 3.52851 4.57496 3.747 4.57306C3.9655 4.57116 4.17451 4.48352 4.32902 4.32901C4.48352 4.17451 4.57117 3.9655 4.57306 3.747C4.57496 3.5285 4.49097 3.318 4.33917 3.16083L3.08917 1.91083C2.9329 1.75461 2.72097 1.66684 2.5 1.66684ZM16.6665 2.5C16.6665 2.27903 16.5787 2.0671 16.4225 1.91083C16.2662 1.75461 16.0543 1.66684 15.8333 1.66684C15.6124 1.66684 15.4005 1.75461 15.2442 1.91083L13.9942 3.16083C13.9146 3.2377 13.8511 3.32966 13.8074 3.43133C13.7638 3.533 13.7408 3.64235 13.7398 3.753C13.7388 3.86365 13.7599 3.97338 13.8018 4.07579C13.8437 4.17821 13.9056 4.27125 13.9838 4.34949C14.0621 4.42774 14.1551 4.48962 14.2576 4.53152C14.36 4.57342 14.4697 4.5945 14.5803 4.59354C14.691 4.59258 14.8003 4.56959 14.902 4.52592C15.0037 4.48224 15.0956 4.41876 15.1725 4.33916L16.4225 3.08916C16.5787 2.93289 16.6665 2.72097 16.6665 2.5ZM0.244077 8.57741C0.087797 8.73369 0 8.94565 0 9.16666C0 9.38767 0.087797 9.59967 0.244077 9.75587C0.400357 9.91217 0.612317 9.99997 0.833337 9.99997H1.66667C1.88768 9.99997 2.09964 9.91217 2.25593 9.75587C2.41221 9.59967 2.5 9.38767 2.5 9.16666C2.5 8.94565 2.41221 8.73369 2.25593 8.57741C2.09964 8.42113 1.88768 8.33333 1.66667 8.33333H0.833337C0.612317 8.33333 0.400357 8.42113 0.244077 8.57741ZM16.0774 8.57741C15.9211 8.73369 15.8333 8.94565 15.8333 9.16666C15.8333 9.38767 15.9211 9.59967 16.0774 9.75587C16.2337 9.91217 16.4457 9.99997 16.6667 9.99997H17.5C17.721 9.99997 17.933 9.91217 18.0893 9.75587C18.2455 9.59967 18.3333 9.38767 18.3333 9.16666C18.3333 8.94565 18.2455 8.73369 18.0893 8.57741C17.933 8.42113 17.721 8.33333 17.5 8.33333H16.6667C16.4457 8.33333 16.2337 8.42113 16.0774 8.57741ZM4.58316 14.5834C4.58316 14.3624 4.49539 14.1505 4.33917 13.9942C4.1829 13.838 3.97097 13.7502 3.75 13.7502C3.52903 13.7502 3.31711 13.838 3.16084 13.9942L1.91084 15.2442C1.75904 15.4014 1.67504 15.6119 1.67694 15.8304C1.67884 16.0489 1.76648 16.2579 1.92099 16.4124C2.07549 16.5669 2.2845 16.6545 2.503 16.6564C2.7215 16.6583 2.932 16.5743 3.08917 16.4225L4.33917 15.1725C4.49539 15.0163 4.58316 14.8043 4.58316 14.5834ZM14.5833 13.7502C14.3624 13.7502 14.1505 13.838 13.9942 13.9942C13.838 14.1505 13.7502 14.3624 13.7502 14.5834C13.7502 14.8043 13.838 15.0163 13.9942 15.1725L15.2442 16.4225C15.4013 16.5743 15.6118 16.6583 15.8303 16.6564C16.0488 16.6545 16.2579 16.5669 16.4124 16.4124C16.5669 16.2579 16.6545 16.0489 16.6564 15.8304C16.6583 15.6119 16.5743 15.4014 16.4225 15.2442L15.1725 13.9942C15.0162 13.838 14.8043 13.7502 14.5833 13.7502ZM9.75589 16.0774C9.59969 15.9212 9.38769 15.8334 9.16667 15.8334C8.94566 15.8334 8.73369 15.9212 8.57741 16.0774C8.42113 16.2337 8.33334 16.4457 8.33334 16.6667V17.5C8.33334 17.721 8.42113 17.933 8.57741 18.0893C8.73369 18.2456 8.94566 18.3334 9.16667 18.3334C9.38769 18.3334 9.59969 18.2456 9.75589 18.0893C9.91219 17.933 9.99999 17.721 9.99999 17.5V16.6667C9.99999 16.4457 9.91219 16.2337 9.75589 16.0774ZM6.22039 6.22039C7.00179 5.43899 8.0616 5 9.16667 5C10.2717 5 11.3316 5.43899 12.113 6.22039C12.8944 7.00179 13.3333 8.0616 13.3333 9.16666C13.3333 10.2718 12.8944 11.3316 12.113 12.113C11.3316 12.8944 10.2717 13.3334 9.16667 13.3334C8.0616 13.3334 7.00179 12.8944 6.22039 12.113C5.43899 11.3316 5 10.2718 5 9.16666C5 8.0616 5.43899 7.00179 6.22039 6.22039Z'
										fill='#828FA3'
									/>
								</svg>
								{mounted && (
									<Switch
										checked={theme === 'dark'}
										onCheckedChange={(checked) =>
											setTheme(checked ? 'dark' : 'light')
										}
									/>
								)}
								<svg
									width='15'
									height='15'
									viewBox='0 0 15 15'
									fill='none'
									xmlns='http://www.w3.org/2000/svg'>
									<path
										fillRule='evenodd'
										clipRule='evenodd'
										d='M14.2417 9.70085C14.6492 9.52085 15.135 9.86585 14.965 10.2708C13.805 13.0458 11.0217 15 7.7717 15C3.47917 15 0 11.5908 0 7.38505C0 3.84422 2.46667 0.867549 5.8075 0.0150492C6.24083 -0.0949508 6.525 0.421719 6.28833 0.795049C5.66988 1.76919 5.34206 2.89951 5.34333 4.05339C5.34333 7.47089 8.17 10.2408 11.6575 10.2408C12.547 10.2423 13.4271 10.0584 14.2417 9.70085ZM9.835 0.759209C9.5408 0.317549 10.0675 -0.209121 10.5092 0.0858792L11.2967 0.610879C11.616 0.823849 11.9912 0.937509 12.375 0.937509C12.7588 0.937509 13.134 0.823849 13.4533 0.610879L14.24 0.0858792C14.6825 -0.209121 15.2092 0.317549 14.9142 0.759209L14.3892 1.54671C14.1762 1.86602 14.0625 2.24123 14.0625 2.62505C14.0625 3.00886 14.1762 3.38408 14.3892 3.70338L14.9142 4.49088C15.2092 4.93255 14.6825 5.45921 14.2408 5.16421L13.4533 4.63921C13.134 4.42624 12.7588 4.31259 12.375 4.31259C11.9912 4.31259 11.616 4.42624 11.2967 4.63921L10.51 5.16421C10.0683 5.45921 9.5408 4.93255 9.835 4.49088L10.36 3.70338C10.573 3.38408 10.6866 3.00886 10.6866 2.62505C10.6866 2.24123 10.573 1.86602 10.36 1.54671L9.835 0.759209Z'
										fill='#828FA3'
									/>
								</svg>
							</div>

							<SignOutButton>
								<button
									className={cn(
										'flex items-center justify-center gap-3.75 h-12 -mx-6 pl-6',
										'transition-all duration-300 ease-in-out',
										'hover:bg-red-hover text-red hover:text-[#fff]',
									)}>
									<LogOutIcon />
									<span className='text-h-m'>Log out</span>
								</button>
							</SignOutButton>
						</DialogContent>
					</Dialog>
				</div>

				<div className='flex items-center gap-4 sm:gap-6'>
					<Dialog open={openNewTaskModal} onOpenChange={setOpenNewTaskModal}>
						<DialogTrigger
							asChild
							disabled={boards?.length === 0 || board?.columns?.length === 0}>
							<Button className=' h-8 sm:h-12 px-4.5 sm:px-6'>
								+ <span className='hidden sm:block'>Add New Task</span>
							</Button>
						</DialogTrigger>
						<NewTask board={board} onClose={() => setOpenNewTaskModal(false)} />
					</Dialog>

					<Popover
						open={openBoardOptionsModal}
						onOpenChange={setOpenBoardOptionsModal}>
						<PopoverTrigger asChild disabled={boards?.length === 0}>
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
