/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
      // {
      //   protocol: "localhost",
      //   hostname: "**",
      //   port: "3000",
      //   pathname: "http",
      // },
    ],
  },
};

export default nextConfig;
