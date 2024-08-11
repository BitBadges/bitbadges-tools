'use client';

import { useState } from 'react';
import { ReposToolComponent } from './tools/github/privateRepos';
import { SessionProvider } from 'next-auth/react';
import { CalendarAttendeesToolComponent } from './tools/google/calendarAttendees';
import { CalendlyEventsToolComponent } from './tools/calendly/calendly';
import { MailchimpListsToolComponent } from './tools/mailchimp/mailchimp';

const tools = [
    {
        id: 'github',
        name: 'GitHub Repositories',
        description: 'View your private GitHub repositories',
        icon: '📚',
        provider: 'github',
    },
    {
        id: 'google',
        name: 'Google Calendar',
        description: 'View your Google Calendar events',
        icon: '📅',
        provider: 'google',
    },
    {
        id: 'calendly',
        name: 'Calendly Events',
        description: 'View your upcoming Calendly events',
        icon: '📆',
        provider: 'calendly',
    },
    {
        id: 'mailchimp',
        name: 'Mailchimp Lists',
        description: 'View your Mailchimp email lists',
        icon: '📧',
        provider: 'mailchimp',
    },
];

export interface ToolResultMessage {
    id: string;
    publicParams: any;
    privateParams: any;
}

export default function ToolSelectorClient({ provider }: { provider: string }) {
    const [selectedTool, setSelectedTool] = useState<string | null>(null);
    let filteredTools = tools.filter((tool) => tool.provider === provider);
    if (selectedTool) {
        filteredTools = filteredTools.filter(
            (tool) => tool.id === selectedTool
        );
    }

    return (
        <div className="w-full max-w-md">
            <SessionProvider>
                <h2 className="text-xl font-bold mb-4 text-center">
                    Select a Tool
                </h2>
                {filteredTools.map((tool) => (
                    <button
                        key={tool.id}
                        className="w-full mb-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors   items-center justify-between"
                        onClick={() => setSelectedTool(tool.id)}
                    >
                        <div className="flex items-center text-start">
                            <span className="text-2xl mr-3">{tool.icon}</span>
                            <span>{tool.name}</span>
                        </div>
                        <span className="flex text-sm mt-1 text-start text-gray-400">
                            {tool.description}
                        </span>
                    </button>
                ))}
                {selectedTool && (
                    <button
                        className="w-full mb-4 p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-center  items-center justify-between"
                        onClick={() => setSelectedTool(null)}
                    >
                        Unselect Tool
                    </button>
                )}

                {selectedTool === 'github' && <ReposToolComponent />}

                {selectedTool === 'google' && (
                    <CalendarAttendeesToolComponent />
                )}

                {selectedTool === 'calendly' && <CalendlyEventsToolComponent />}
                {selectedTool === 'mailchimp' && (
                    <MailchimpListsToolComponent />
                )}
            </SessionProvider>
        </div>
    );
}

interface ItemProps {
    title: string;
    subtext: string;
    emails?: string[];
    description?: string;
    onSelect: () => void;
}

export function ItemCard({
    title,
    subtext,
    emails,
    description,
    onSelect,
}: ItemProps) {
    return (
        <li className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <h4 className="text-lg font-medium text-white">{title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{subtext}</p>
                </div>
                <button
                    onClick={onSelect}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
                >
                    Select
                </button>
            </div>
            {emails && emails.length > 0 && <EmailList emails={emails} />}
            {description && (
                <p className="text-sm text-gray-400 mt-1">{description}</p>
            )}
        </li>
    );
}

interface EmailListProps {
    emails: string[];
}

export function EmailList({ emails }: EmailListProps) {
    return (
        <div className="mt-2">
            <div className="flex flex-wrap gap-2">
                {emails.map((email) => (
                    <span
                        key={email}
                        className="bg-gray-600 text-gray-200 px-2 py-1 rounded-full text-xs"
                    >
                        {email}
                    </span>
                ))}
            </div>
        </div>
    );
}
