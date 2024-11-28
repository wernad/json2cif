'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '@/lib/cn';

import { RadioInput } from './radio-input';
import { useJSONContext } from '@/app/providers';
import { IdInput } from './id-input';


const formSchema = z.object({
    protein_id: z.string().min(3),
    database: z.string()
});

const API_URL = "https://channelsdb2.biodata.ceitec.cz/api/channels/";
type FormSchema = z.infer<typeof formSchema>;

export const IdForm = () => {
    const { setFile } = useJSONContext();
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema)
    });

    const onSubmit = async (values: FormSchema) => {
        setIsPending(true);

        const fetchJSON = async (db: string, protein_id: string) => {
            const response = await fetch(API_URL + db + "/" + protein_id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            return data;
        };
        const response = await fetchJSON(values.database, values.protein_id)

        if (response) {
            if ("detail" in response) {
                toast.error(`Protein id ${values.protein_id} not found in ChannelsDB.`)
                setIsPending(false);
            }
            else {
                toast.success('Fetching successful.');
                setIsPending(false);

                setFile({ header: `Protein: ${values.protein_id}`, data: JSON.stringify(response, null, 2) });
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
                    <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white">Convert Form</h2>

                    <div className="flex items-center justify-center space-x-4">
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
                    </div>

                    <IdInput name="protein_id" label="Protein ID:" />

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
                                'Fetch and convert'
                            )}
                        </button>
                    </div>
                </form>
            </FormProvider>
        </div>
    );
};
