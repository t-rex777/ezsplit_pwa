import { type JSX, memo } from "react";

const ShowAppLoading = memo((): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Animated Logo */}
        <div className="mb-8">
          <div className="relative mx-auto h-24 w-24">
            {/* Outer Ring */}
            <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
            <div
              className="absolute inset-0 rounded-full border-2 border-purple-500/30 animate-ping"
              style={{ animationDelay: "0.5s" }}
            />

            {/* Inner Circle */}
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 animate-pulse" />

            {/* Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-8 w-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="Money icon"
              >
                <title>Money icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* App Name */}
        <h1 className="mb-4 text-3xl font-light text-white tracking-wider">
          EzSplit
        </h1>

        {/* Minimal Loading Animation */}
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={`loading-dot-${i}`}
              className="h-2 w-2 rounded-full bg-white/60 animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: "1.5s",
              }}
            />
          ))}
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={`particle-${i}`}
            className="absolute h-1 w-1 bg-white/20 rounded-full animate-float"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
});

ShowAppLoading.displayName = "ShowAppLoading";

export { ShowAppLoading };
