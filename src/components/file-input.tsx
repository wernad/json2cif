import { HTMLProps, useState } from 'react';
import { useFormContext } from 'react-hook-form';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    name: string;
    label: string;
};

export const FileInput = ({ name, label, className, ...inputProps }: FormInputProps) => {
    const { register, formState: { errors } } = useFormContext();
    const [fileName, setFileName] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFileName(event.target.files[0].name);
        } else {
            setFileName(null);
        }
    };


    return (
        <div className="flex items-center justify-center w-full">
            <label
                htmlFor={name}
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
            >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        {errors[name] ? (
                            <span className="mt-2 text-sm text-red-600 dark:text-red-400">
                                {errors[name]?.message?.toString()}
                            </span>
                        ) : fileName ? (
                            <span className="text-green-600 dark:text-green-400">
                                {fileName}
                            </span>
                        ) : (
                            <>JSON files only</>
                        )}</p>
                </div>
                <input
                    id={name}
                    type="file"
                    className="hidden"
                    {...inputProps}
                    {...register(name, { onChange: handleFileChange })}
                />
            </label>

        </div>

    )
};

