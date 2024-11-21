import { HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    id: string;
    name: string;
    label: string;
};

export const RadioInput = ({ id, name, label, className, ...inputProps }: FormInputProps) => {
    const { register, formState: { errors } } = useFormContext();


    return (
        <div>
            <div className="flex space-x-4"> {/* Flex container to hold two radio buttons side-by-side */}
                <div className="flex items-center p-4 border border-gray-200 rounded">
                    <label htmlFor={id} className="w-full text-sm font-medium text-black dark:text-white">
                        {label}
                        <input
                            id={id}
                            className={cn(
                                'w-4 h-4 ml-2 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2',
                                errors[name] && 'input-error',
                                className
                            )}
                            type="radio"
                            {...inputProps}
                            {...register(name)}
                        />
                    </label>
                </div>
            </div>
            {errors[name] && (
                <span className="block mt-2 text-sm text-red-600">
                    {errors[name]?.message?.toString()}
                </span>
            )}
        </div>
    )
};


/*
<div class="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700">
    <input id="bordered-radio-1" type="radio" value="" name="bordered-radio" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600">
    <label for="bordered-radio-1" class="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Default radio</label>
</div>
*/