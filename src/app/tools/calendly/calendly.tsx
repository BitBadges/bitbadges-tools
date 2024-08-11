import { ItemCard } from '@/app/ToolSelectorClient';
import { useEffect, useState } from 'react';

interface CalendlyEvent {
    uri: string;
    name: string;
    start_time: string;
    end_time: string;
    invitees_counter: {
        total: number;
    };
}

export function CalendlyEventsToolComponent() {
    const [events, setEvents] = useState<CalendlyEvent[] | null>(null);
    const [loading, setLoading] = useState(true);

    function getPostMessageFromEvent(event: CalendlyEvent) {
        return {
            id: 'calendly',
            publicParams: {},
            privateParams: {
                eventUri: event.uri,
                eventName: event.name,
                startTime: event.start_time,
                endTime: event.end_time,
                inviteeCount: event.invitees_counter.total,
            },
        };
    }

    useEffect(() => {
        const fetchCalendlyEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/calendly/events');
                if (!response.ok) {
                    throw new Error('Failed to fetch Calendly events');
                }
                const data = await response.json();
                setEvents(data);
            } catch (error) {
                console.error('Error fetching Calendly events:', error);
                setEvents(null);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendlyEvents();
    }, []);

    return (
        <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
                Your Calendly Events
            </h3>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : events === null ? (
                <p className="text-gray-400">
                    Please sign in to view your Calendly events.
                </p>
            ) : events.length === 0 ? (
                <p className="text-gray-400">
                    You do not have any upcoming Calendly events.
                </p>
            ) : (
                <ul className="space-y-4">
                    {events.map((event) => (
                        <ItemCard
                            key={event.uri}
                            title={event.name}
                            subtext={`${new Date(
                                event.start_time
                            ).toLocaleString()} - ${new Date(
                                event.end_time
                            ).toLocaleString()}`}
                            description={`Invitees: ${event.invitees_counter.total}`}
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
