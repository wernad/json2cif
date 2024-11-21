import { HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    name: string;
    label: string;
};

export const IdInput = ({ name, label, className, ...inputProps }: FormInputProps) => {
    const { register, formState: { errors } } = useFormContext();


    return (
        <div>
            <label htmlFor={name} className="form-control w-full">
                {label}
            </label>
            <input
                id={name}
                className={cn(
                    "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500", errors[name] && 'input-error', className
                )}
                placeholder="e.g. 11ba, Kcsa, P08686, etc"
                {...register(name, { minLength: 3, required: true })}
                {...inputProps}
            />
            <p className="text-red-500"> {errors[name] && (
                <span className="mt-1 text-sm text-error">
                    {errors[name]?.message?.toString()}
                </span>
            )}</p>
        </div>
    )
};

