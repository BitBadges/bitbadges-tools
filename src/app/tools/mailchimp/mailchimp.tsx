import { ItemCard } from '@/app/ToolSelectorClient';
import { useEffect, useState } from 'react';

interface MailchimpList {
    id: string;
    name: string;
    stats: {
        member_count: number;
    };
}

export function MailchimpListsToolComponent() {
    const [lists, setLists] = useState<MailchimpList[] | null>(null);
    const [loading, setLoading] = useState(true);

    function getPostMessageFromList(list: MailchimpList) {
        return {
            id: 'mailchimp',
            publicParams: {},
            privateParams: {
                listId: list.id,
                listName: list.name,
                memberCount: list.stats.member_count,
            },
        };
    }

    useEffect(() => {
        const fetchMailchimpLists = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/mailchimp/lists');
                if (!response.ok) {
                    throw new Error('Failed to fetch Mailchimp lists');
                }
                const data = await response.json();
                setLists(data);
            } catch (error) {
                console.error('Error fetching Mailchimp lists:', error);
                setLists(null);
            } finally {
                setLoading(false);
            }
        };
        fetchMailchimpLists();
    }, []);

    return (
        <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
                Your Mailchimp Lists
            </h3>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : lists === null ? (
                <p className="text-gray-400">
                    Please sign in to view your Mailchimp lists.
                </p>
            ) : lists.length === 0 ? (
                <p className="text-gray-400">
                    You do not have any Mailchimp lists.
                </p>
            ) : (
                <ul className="space-y-4">
                    {lists.map((list) => (
                        <ItemCard
                            key={list.id}
                            title={list.name}
                            subtext={`Members: ${list.stats.member_count}`}
                            onSelect={() => {
                                if (!window.opener) {
                                    alert(
                                        'This tool must be opened via a redirect from the BitBadges site'
                                    );
                                    return;
                                }

                                window.opener.postMessage(
                                    getPostMessageFromList(list),
                                    'https://bitbadges.io'
                                );
                                window.close();
                            }}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
}
