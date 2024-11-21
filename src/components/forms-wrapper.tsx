'use client';

import { FileForm } from "./file-form";
import { IdForm } from "./id-form";


export const FormsWrapper = () => {



    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gradient-to-b dark:from-gray-700 dark:to-gray-500 dark:text-white p-4">
            <IdForm />
            <FileForm />
        </div>
    );
};
