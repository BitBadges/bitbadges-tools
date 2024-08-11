/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            // ... other domains
            'assets.calendly.com',
            'zapier-images.imgix.net',
        ],
    },
};

export default nextConfig;
