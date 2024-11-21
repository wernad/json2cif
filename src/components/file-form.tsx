'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';

import { FileInput } from './file-input';
import { useJSONContext } from '@/app/providers';

function checkFileType(file: File) {
    if (file?.name) {
        const fileType = file.name.split(".").pop();
        if (fileType === "json") {
            return true;
        }
    }
    return false;
}

const formSchema = z.object({
    file: z.any()
        .refine((fileList: FileList) => fileList?.length !== 0, "File is required")
        .refine((fileList: FileList) => checkFileType(fileList[0]), "Only .json format is supported."),
});

type FormSchema = z.infer<typeof formSchema>;

export const FileForm = () => {
    const { file, setFile } = useJSONContext();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (values: FormSchema) => {
        setIsPending(true);

        const file = values.file[0];

        if (file) {
            toast.success('File loaded.');
            setIsPending(false);
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = () => {
                setFile({ header: `File: ${file.name}`, data: reader.result });
                router.push('/result');
            }
        } else {
            toast.error('Error with form submission.');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-500 dark:text-white p-4">
            <FormProvider {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-full max-w-md space-y-6 rounded-lg bg-white dark:bg-gray-700 p-8 shadow-lg"
                >
                    <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">Upload JSON file</h2>

                    <FileInput
                        name="file"
                        label="Upload File"
                    />

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                'w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200',
                                isPending && 'cursor-not-allowed opacity-50'
                            )}
                        >
                            {isPending ? (
                                <span className="flex items-center justify-center">
                                    <span className="loading loading-spinner mr-2" /> Converting...
                                </span>
                            ) : (
                                'Convert'
                            )}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
