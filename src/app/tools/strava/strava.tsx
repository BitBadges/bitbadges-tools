import { ItemCard } from '@/app/ToolSelector';
import { useEffect, useState } from 'react';

interface StravaActivity {
    id: number;
    name: string;
    start_date: string;
    athlete: {
        id: number;
        firstname: string;
        lastname: string;
    };
    participants?: {
        id: number;
        firstname: string;
        lastname: string;
    }[];
}

export function StravaActivitiesToolComponent({}: {}) {
    const [activities, setActivities] = useState<StravaActivity[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [isLocalDev, setIsLocalDev] = useState(false);

    useEffect(() => {
        setIsLocalDev(window.location.hostname === 'localhost');
    }, []);

    function getPostMessageFromActivity(activity: StravaActivity) {
        return {
            pluginId: 'strava',
            publicParams: {},
            privateParams: {
                ids:
                    activity.participants?.map((participant) =>
                        participant.id.toString()
                    ) || [],
                usernames:
                    activity.participants?.map(
                        (participant) =>
                            `${participant.firstname} ${participant.lastname}`
                    ) || [],
            },
        };
    }

    useEffect(() => {
        const fetchStravaActivities = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/strava/activities');
                if (!response.ok) {
                    throw new Error('Failed to fetch Strava activities');
                }
                const data = await response.json();
                setActivities(data);
            } catch (error) {
                console.error('Error fetching Strava activities:', error);
                setActivities(null);
            } finally {
                setLoading(false);
            }
        };
        fetchStravaActivities();
    }, []);

    return (
        <div className="mt-6 bg-gray-800 rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">
                Your Strava Activities
            </h3>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : activities === null ? (
                <p className="text-gray-400">
                    Please sign in to view your Strava activities.
                </p>
            ) : activities.length === 0 ? (
                <p className="text-gray-400">
                    You do not have any Strava activities.
                </p>
            ) : (
                <ul className="space-y-4">
                    {activities.map((activity) => (
                        <ItemCard
                            key={activity.id}
                            title={activity.name}
                            subtext={new Date(
                                activity.start_date
                            ).toLocaleString()}
                            emails={
                                activity.participants?.map(
                                    (participant) =>
                                        `${participant.firstname} ${participant.lastname}`
                                ) || []
                            }
                            onSelect={() => {
                                if (!window.opener) {
                                    alert(
                                        'This tool must be opened via a redirect from the BitBadges site'
                                    );
                                    return;
                                }

                                window.opener.postMessage(
                                    getPostMessageFromActivity(activity),
                                    isLocalDev
                                        ? 'http://localhost:3000'
                                        : 'https://bitbadges.io'
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
