'use client';

import { useJSONContext } from "@/app/providers";
import { Result } from "@/components/result";
import { JSON2CIF } from "@/lib/converter";
import { useEffect, useState } from "react";
import { DownloadButton } from "./download-button";

export const ResultWrapper = () => {
    const { file } = useJSONContext();
    const header = file.header;
    const [result, setResult] = useState("");

    useEffect(() => {
        const convertedResult = JSON2CIF(file.header, file.data as string);
        setResult(convertedResult);
    }, [file]);

    if (file === null || file.data === null) {
        return "No file loaded."
    }

    return (
        <>
            <div className="flex justify-between items-center w-full p-4 bg-gray-100 dark:bg-gray-800 overflow-auto text-sm text-black dark:text-gray-200">
                <div className="flex-1 flex justify-center">
                    <h2 className="text-2xl">{header}</h2>
                </div>

                <DownloadButton fileName={file.header} fileContent={result} className="ml-auto" />
            </div>
            <div className="flex items-center w-full bg-gray-100 dark:bg-gray-800 space-x-4">
                <Result className="flex-grow max-h-[calc(100vh-6rem)] overflow-auto" result={file.data as string} />
                {result ?
                    <Result className="flex-grow max-h-[calc(100vh-6rem)] overflow-auto" result={result as string} />
                    : "Converting..."}
            </div>
        </>
    );
};