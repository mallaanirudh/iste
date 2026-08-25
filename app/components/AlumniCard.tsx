import { Alumni } from "../../lib/data/alumni";

interface AlumniCardProps {
  alumni: Alumni;
}

export default function AlumniCard({ alumni }: AlumniCardProps) {
  return (
    <div
      className="
        group relative overflow-hidden
        rounded-2xl
        border border-white/10
        bg-white/[0.06]
        p-6
        backdrop-blur-md
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        transition-all duration-300
        hover:-translate-y-1
        hover:border-white/20
        hover:bg-white/[0.09]
        hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]
      "
    >
      {/* Subtle glow */}
      <div
        className="
          pointer-events-none absolute -right-10 -top-10
          h-24 w-24 rounded-full
          bg-white/[0.04]
          blur-2xl
          transition-all duration-500
          group-hover:bg-white/[0.08]
        "
      />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-white">
            {alumni.name}
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            NITK · {alumni.graduationYear}
          </p>
        </div>

        <a
          href={alumni.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            rounded-lg
            border border-white/10
            bg-white/[0.05]
            px-3 py-1.5
            text-sm font-medium
            text-gray-300
            transition
            hover:border-white/20
            hover:bg-white/10
            hover:text-white
          "
        >
          LinkedIn
        </a>
      </div>

      <div className="relative mt-6 space-y-3 text-sm">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
            Organization
          </p>
          <p className="text-gray-300">
            {alumni.organization}
          </p>
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-wider text-gray-500">
            Location
          </p>
          <p className="text-gray-300">
            {alumni.location}
          </p>
        </div>
      </div>
    </div>
  );
}