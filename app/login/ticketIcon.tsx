export default function TicketIcon({
  className = "h-9 w-14",
}: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 40"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Gradient in Stilyco-ish colors */}
      <defs>
        <linearGradient id="ya2gGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ff6b6f" />
          <stop offset="60%" stopColor="#b14cff" />
          <stop offset="100%" stopColor="#ff8a3d" />
        </linearGradient>

        {/* Cut semicircles from the sides */}
        <mask id="ticketCut">
          {/* Everything visible by default */}
          <rect width="64" height="40" fill="#fff" />
          {/* Carve side notches (match left panel bg: we use mask so it’s universal) */}
          <circle cx="0" cy="20" r="6" fill="#000" />
          <circle cx="64" cy="20" r="6" fill="#000" />
        </mask>
      </defs>

      {/* Ticket body with rounded corners + side notches via mask */}
      <rect
        x="1"
        y="1"
        width="62"
        height="38"
        rx="8"
        fill="url(#ya2gGrad)"
        mask="url(#ticketCut)"
      />

      {/* Perforation (dashed) */}
      <line
        x1="32"
        y1="6"
        x2="32"
        y2="34"
        stroke="white"
        strokeOpacity="0.7"
        strokeWidth="2"
        strokeDasharray="3 4"
      />
    </svg>
  );
}
