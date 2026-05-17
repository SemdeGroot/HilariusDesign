/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  trailingSlash: true,
  allowedDevOrigins: ["*.ngrok-free.dev", "*.ngrok-free.app"],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
