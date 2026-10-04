/**
 * InitialsAvatar
 * A deterministic avatar that shows the user's initials on a coloured background.
 * No external requests — colour is derived from the name so it is consistent
 * across refreshes and devices.
 *
 * Props:
 *   name   {string}  – display name ("John Doe"). Falls back to "?" if empty.
 *   size   {number}  – pixel dimensions for the square (default 40).
 *   className {string} – extra Tailwind classes (e.g. "rounded-full border-2 border-primary/20").
 */

const PALETTE = [
  "#6366f1", // indigo
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#3b82f6", // blue
  "#ef4444", // red
  "#14b8a6", // teal
  "#f97316", // orange
  "#84cc16", // lime
];

function pickColour(name) {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

function getInitials(name) {
  if (!name || !name.trim()) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const InitialsAvatar = ({ name, size = 40, className = "" }) => {
  const bg = pickColour(name);
  const initials = getInitials(name);
  const fontSize = Math.round(size * 0.38);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-label={name ? `${name} avatar` : "User avatar"}
      className={className}
    >
      <rect width={size} height={size} fill={bg} rx={size / 2} />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="#ffffff"
        fontSize={fontSize}
        fontFamily="ui-sans-serif, system-ui, sans-serif"
        fontWeight="600"
      >
        {initials}
      </text>
    </svg>
  );
};

export default InitialsAvatar;
