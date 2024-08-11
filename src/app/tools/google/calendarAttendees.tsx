import { ItemCard } from '@/app/ToolSelectorClient';
import { calendar_v3 } from 'googleapis';
import { useEffect, useState } from 'react';

export function CalendarAttendeesToolComponent({}: {}) {
    const [events, setEvents] = useState<calendar_v3.Schema$Event[] | null>(
        null
    );

    const [loading, setLoading] = useState(true);

    function getPostMessageFromEvent(event: calendar_v3.Schema$Event) {
        return {
            id: 'email',
            publicParams: {},
            privateParams: {
                ids: event.attendees?.map((attendee) => attendee.email) || [],
                useernames: [],
            },
        };
    }

    useEffect(() => {
        const fetchCalendarEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/google/calendar');
                if (!response.ok) {
                    throw new Error('Failed to fetch calendar events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching calendar events:', error);
                setEvents(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendarEvents();
    }, []);

    return (
        <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
                Your Calendar Events
            </h3>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : events === null ? (
                <p className="text-gray-400">
                    Please sign in to view your calendar events.
                </p>
            ) : events.length === 0 ? (
                <p className="text-gray-400">
                    You do not have any calendar events.
                </p>
            ) : (
                <ul className="space-y-4">
                    {events.map((event) => (
                        <ItemCard
                            key={event.id}
                            title={event.summary || ''}
                            subtext={
                                new Date(
                                    event.start?.dateTime || ''
                                ).toLocaleString() || ''
                            }
                            emails={(
                                event.attendees?.map(
                                    (attendee) => attendee.email || ''
                                ) || []
                            ).filter((email) => email !== '')}
                            onSelect={() => {
                                if (!window.opener) {
                                    alert(
                                        'This tool must be opened via a redirect from the BitBadges site'
                                    );
                                    return;
                                }

                                window.opener.postMessage(
                                    getPostMessageFromEvent(event),
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
