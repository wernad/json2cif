'use client';

import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from 'react';
import { Toaster } from 'sonner';


export const Providers = ({ children }: PropsWithChildren) => (
    <JSONFileProvider>
        {children}
        <Toaster richColors />
    </JSONFileProvider >
);

export type ReaderResult = string | null | ArrayBuffer

type JSONFile = {
    data: ReaderResult
    header: string
}


export type JSONFileType = {
    file: JSONFile;
    setFile: (file: JSONFile) => void;
};

const JSONFileContext = createContext<JSONFileType | null>(null);

export const useJSONContext = () => {
    const file = useContext(JSONFileContext);

    if (!file) {
        throw new Error('useJSONContext must be used within a JSONFileProvider.');
    }

    return file;
};

export const JSONFileProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [file, setFile] = useState<JSONFile>(() => {
        const savedFile = localStorage.getItem("jsonFile");
        return savedFile ? JSON.parse(savedFile) : { header: "", data: null };
    });

    useEffect(() => {
        if (file.data !== null) {
            localStorage.setItem("jsonFile", JSON.stringify(file));
        }
    }, [file]);

    const value = useMemo(
        () => ({
            file,
            setFile
        }),
        [file]
    );

    return (
        <JSONFileContext.Provider value={value}>
            {children}
        </JSONFileContext.Provider>
    );
};
