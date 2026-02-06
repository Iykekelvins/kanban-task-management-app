import * as React from 'react';

import { cn } from '@/lib/utils';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
	return (
		<textarea
			data-slot='textarea'
			className={cn(
				'border-borders placeholder:text-black/25 font-medium focus-visible:ring-[1px] aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base  transition-[color,box-shadow] outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
				className,
			)}
			{...props}
		/>
	);
}

export { Textarea };
