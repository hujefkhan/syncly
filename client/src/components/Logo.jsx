export default function Logo({ size = 28, withText = true }) {
const colorTheme =
  localStorage.getItem('colorTheme');

const logoColor =
  colorTheme === 'cozy'
    ? '#8EB6D9'
    : '#7C3AED';

  return (
    <div className="flex items-center gap-2">

      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">

        <path
          d="M12 2L2 7l10 5 10-5-10-5z"
          fill={logoColor}
        />

        <path
          d="M2 17l10 5 10-5M2 12l10 5 10-5"
          stroke={logoColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

      </svg>

      {withText && (
      <span
  className="font-display font-extrabold text-xl"
  style={{
    color:
      colorTheme === 'cozy'
        ? '#8EB6D9'
        : '#7C3AED'
  }}
>
          Syncly
        </span>
      )}

    </div>
  );
}