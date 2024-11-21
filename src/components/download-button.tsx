import { HTMLProps } from 'react';

import { cn } from '@/lib/cn';

type FormInputProps = HTMLProps<HTMLInputElement> & {
    fileName: string;
    fileContent: string | ArrayBuffer
};

export const DownloadButton = ({ fileName, fileContent, className }: FormInputProps) => {
    const handleDownload = () => {
        const blob = new Blob([fileContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.cif`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return <div>
        <button onClick={handleDownload} className={cn(className, "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800")}>
            Download CIF File
        </button>
    </div >
};

