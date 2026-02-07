'use client';

import * as React from 'react';
import { CheckIcon } from 'lucide-react';
import { Checkbox as CheckboxPrimitive } from 'radix-ui';

import { cn } from '@/lib/utils';

function Checkbox({
	className,
	...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
	return (
		<CheckboxPrimitive.Root
			data-slot='checkbox'
			className={cn(
				'peer border border-borders bg-white data-[state=checked]:bg-purple data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary aria-invalid:ring-red/20 dark:aria-invalid:ring-red/40 aria-invalid:border-red size-4 shrink-0 rounded-xs outline-none  disabled:cursor-not-allowed disabled:opacity-50',
				className,
			)}
			{...props}>
			<CheckboxPrimitive.Indicator
				data-slot='checkbox-indicator'
				className='grid place-content-center text-current transition-none'>
				<CheckIcon className='size-3.5 text-[#fff]' />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);
}

export { Checkbox };
