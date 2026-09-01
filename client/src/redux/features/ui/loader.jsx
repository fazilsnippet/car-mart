import { Car } from "lucide-react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-sm">
      <div className="flex flex-col items-center">

        {/* Loader */}
        <div className="relative flex items-center justify-center w-24 h-24">

          {/* Outer rotating ring */}
          <div
            className="absolute inset-0 border-2 rounded-full  border-slate-800 border-t-amber-400 border-r-amber-400/40 animate-spin"
          />

          {/* Inner rotating ring */}
          <div
            className="
              absolute
              inset-3
              rounded-full
              border
              border-slate-700
              border-b-amber-400/80
              animate-[spin_1.5s_linear_infinite_reverse]
            "
          />

          {/* Car icon */}
          <div
            className="
              relative
              flex
              items-center
              justify-center

              w-12
              h-12

              rounded-full

              bg-[#0d1117]

              border
              border-slate-800

              shadow-[0_0_25px_rgba(251,191,36,0.15)]
            "
          >
            <Car
              className="w-6 h-6  text-amber-400 animate-pulse"
              strokeWidth={1.7}
            />
          </div>

        </div>

        {/* Brand */}
        <div className="mt-5 text-center">

          <h2
            className="
              text-lg
              font-bold
              tracking-[0.25em]
              text-white
            "
          >
            WISH{" "}
            <span className="text-amber-400">
              WHEELS
            </span>
          </h2>

          <p
            className="
              mt-1
              text-[10px]
              uppercase
              tracking-[0.3em]
              text-slate-500
            "
          >
            Finding your next drive
          </p>

        </div>

        {/* Loading bar */}
        <div className="w-40 h-0.5 mt-5 overflow-hidden rounded-full bg-slate-800">

          <div
            className="
              h-full
              w-1/2

              rounded-full

              bg-gradient-to-r
              from-transparent
              via-amber-400
              to-transparent

              animate-[loading_1.4s_ease-in-out_infinite]
            "
          />

        </div>

      </div>

      {/* Custom animation */}
      <style>{`
        @keyframes loading {
          0% {
            transform: translateX(-200%);
          }

          100% {
            transform: translateX(400%);
          }
        }
      `}</style>

    </div>
  );
};

export default Loader;