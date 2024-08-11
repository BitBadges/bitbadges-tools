import ToolSelectorClient from './ToolSelectorClient';

export default async function ToolSelectorServer({
    provider,
}: {
    provider: string;
}) {
    return <ToolSelectorClient provider={provider} />;
}
