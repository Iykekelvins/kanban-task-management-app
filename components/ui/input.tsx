import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
	return (
		<input
			type={type}
			data-slot='input'
			className={cn(
				'file:text-foreground placeholder:text-black/25 selection:bg-primary selection:text-primary-foreground border-borders h-10 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				'focus-visible:ring-[1px]',
				'aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red',
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
