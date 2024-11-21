'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';

import { RadioInput } from './radio-input';
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
    // database: z.string()
});

type FormSchema = z.infer<typeof formSchema>;

export const ConvertForm = () => {
    const { file, setFile } = useJSONContext();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (values: FormSchema) => {
        setIsPending(true);

        // TODO use after CORS is fixed on channelsdb side.
        // const fetchJSON = async (db: string, protein: string) => {
        //     const response = await fetch(api_url + db + "/" + protein, {
        //         method: 'GET',
        //         headers: {
        //             'Content-Type': 'application/json',
        //             'Access-Control-Allow-Origin': 'https://channelsdb2.biodata.ceitec.cz/api'
        //         },
        //     });
        //     const data = await response.json();
        //     return data;
        // };

        const file = values.file[0];
        console.log("file: ", file.name)
        if (file) {
            setIsPending(false);
            const reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = () => {
                setFile({ name: file.name, data: reader.result });
                router.push('/result');
                toast.success('Success. Redirecting...');
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
                    <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">Convert Form</h2>

                    {/* <div className="flex items-center justify-center space-x-4">
                        <RadioInput
                            id="pdb"
                            label="PDB"
                            name="database"
                            value="pdb"
                            defaultChecked={true}
                        />
                        <RadioInput
                            id="alpha"
                            label="Alphafil"
                            name="database"
                            value="alphafil"
                        />
                    </div> */}

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
