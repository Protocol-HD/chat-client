/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://chat-php-api:80/api/:path*", // Proxy to Backend
            },
            // {
            //     source: "/api/:path*",
            //     destination: "http://localhost:8081/api/:path*", // Proxy to Backend
            // }
        ];
    },
}

module.exports = nextConfig