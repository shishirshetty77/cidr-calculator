
"use client";

import React, { useState } from 'react';

interface TabsProps {
  tabs: { name: string; content: React.ReactNode };
}

export const Tabs: React.FC<{ items: { id: string, label: string }[], children: (activeId: string) => React.ReactNode }> = ({ items, children }) => {
    const [activeTab, setActiveTab] = useState(items[0].id);

    return (
        <div>
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-4" aria-label="Tabs">
                    {items.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`${
                                activeTab === tab.id
                                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-150`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="pt-8">
                {children(activeTab)}
            </div>
        </div>
    );
};
