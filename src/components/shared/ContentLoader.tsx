import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = () => (
  <ContentLoader
    speed={1}
    width={150}
    height={45}
    viewBox="0 0 150 45"
    backgroundColor="#09090a"
    foregroundColor="#9c9c9c"
  >
    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <circle cx="20" cy="20" r="20" />
  </ContentLoader>
)

export default MyLoader