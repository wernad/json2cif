import { HTMLProps } from 'react';
import { useFormContext } from 'react-hook-form';

import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    name: string;
    label: string;
};

export const NameInput = ({ name, label, className, ...inputProps }: FormInputProps) => {
    const { register, formState: { errors } } = useFormContext();


    return (
        <label htmlFor={name} className="form-control w-full">
            <div className="label"><span className="label-text">{label}</span></div>
            <input
                id={name}
                className={cn(
                    'input input-bordered w-full', errors[name] && 'input-error', className
                )}
                {...inputProps}
                {...register(name)}
            />
            {errors[name] && (
                <span className="mt-1 text-sm text-error">
                    {errors[name]?.message?.toString()}
                </span>
            )}
        </label>
    )
};

