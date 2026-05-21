import type { NextConfig } from "next"

const config: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["scope.flowa.co.za", "localhost:3000"],
    },
  },
}

export default config
