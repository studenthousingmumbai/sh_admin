/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['d22y2gqvewxrcl.cloudfront.net', 'google.com', 'i.pinimg.com', 'www.iconinc.co.uk', 'student-housing-test-bucket.s3.ap-south-1.amazonaws.com']
  }
}

module.exports = nextConfig
