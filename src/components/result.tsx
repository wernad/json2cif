'use client';

import { HTMLProps } from "react";

type ResultProps = HTMLProps<HTMLDivElement> & {
    result: string;
};

export const Result = ({ result, className }: ResultProps) => {

    return (
        <>
            {result ? <div className={className}>
                <pre className="p-4 bg-gray-100 dark:bg-gray-700  overflow-auto text-sm text-black dark:text-gray-200">
                    {result}
                </pre>
            </div> : <p>Loading...</p>}
        </>
    );
};