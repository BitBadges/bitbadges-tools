import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

type Repo = { id: string; name: string };

export function ReposToolComponent() {
    const [privateRepos, setPrivateRepos] = useState<Repo[] | null>(null);
    const { data: session } = useSession();

    async function getPrivateRepos() {
        if (!session || !session.accessToken) {
            console.log('No session or access token available');
            return null;
        }

        try {
            const response = await fetch(
                'https://api.github.com/user/repos?visibility=private',
                {
                    headers: {
                        Authorization: `Bearer ${session.accessToken}`,
                        Accept: 'application/vnd.github.v3+json',
                    },
                }
            );

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(
                    `GitHub API responded with status ${response.status}: ${errorBody}`
                );
                throw new Error(
                    `GitHub API responded with status ${response.status}`
                );
            }

            return response.json();
        } catch (error) {
            console.error('Error fetching private repositories:', error);
            return null;
        }
    }
    useEffect(() => {
        const fetchPrivateRepos = async () => {
            const privateRepos = await getPrivateRepos();
            setPrivateRepos(privateRepos);
        };
        fetchPrivateRepos();
    }, []);

    return (
        <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">
                Your Private Repositories
            </h3>
            {privateRepos === null ? (
                <p>Please sign in to view your private repositories.</p>
            ) : privateRepos.length === 0 ? (
                <p>You do not have any private repositories.</p>
            ) : (
                <ul className="list-disc pl-5">
                    {privateRepos.map((repo) => (
                        <li key={repo.id}>{repo.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}
