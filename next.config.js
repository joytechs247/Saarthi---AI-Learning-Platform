/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
  },
  // Remove the experimental.appDir as it's now stable in Next.js 14
}

module.exports = nextConfig