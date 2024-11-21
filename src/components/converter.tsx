'use client';

import { useJSONContext } from "@/app/providers";
import { Result } from "@/components/result";
import { JSON2CIF } from "@/lib/converter";
import { useEffect, useState } from "react";

export const Converter = () => {
    const { file, setFile } = useJSONContext();
    const header = file.header;
    const [result, setResult] = useState("");

    if (file === null || file.data === null) {
        return "No file loaded."
    } else {

        useEffect(() => {
            const convertedResult = JSON2CIF(file.data as string);
            setResult(convertedResult);
            console.log("here", convertedResult);
        }, [file.data]);
    }


    return (
        <>
            <div className="flex justify-center w-full p-4 bg-gray-100 dark:bg-gray-800  overflow-auto text-sm text-black dark:text-gray-200">
                <h2 className="text-2xl max-h-5 align-middle">{header}</h2>

            </div>
            <div className="flex items-center w-full bg-gray-100 dark:bg-gray-800 space-x-4 overscroll-none">
                <Result className="flex-grow max-h-[calc(100vh-6rem)] overflow-auto" result={file.data as string} />
                {result &&
                    <Result className="flex-grow max-h-[calc(100vh-6rem)] overflow-auto" result={result as string} />
                }
            </div>
        </>
    );
};