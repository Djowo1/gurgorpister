import styles from './Logo.module.css';

export default function Logo({ size = 'md', showText = true }) {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 56 : 40;

  return (
    <div className={`${styles.logo} ${styles[size]}`}>
      <svg
        width={iconSize}
        height={Math.round(iconSize * 1.2)}
        viewBox="0 0 40 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Echo rings (arcs left of card) */}
        <path
          className={styles.echo1}
          d="M10 24 Q4 18 4 24 Q4 30 10 24"
          stroke="#C9A84C"
          strokeWidth="1"
          fill="none"
          opacity="0.4"
          strokeLinecap="round"
        />
        <path
          className={styles.echo2}
          d="M8 24 Q0 15 0 24 Q0 33 8 24"
          stroke="#C9A84C"
          strokeWidth="0.8"
          fill="none"
          opacity="0.25"
          strokeLinecap="round"
        />

        {/* Tarot card outline */}
        <rect
          x="11"
          y="2"
          width="26"
          height="44"
          rx="3"
          stroke="#C9A84C"
          strokeWidth="1.2"
          fill="none"
        />

        {/* Inner card border (decorative) */}
        <rect
          x="13.5"
          y="4.5"
          width="21"
          height="39"
          rx="1.5"
          stroke="#C9A84C"
          strokeWidth="0.5"
          fill="none"
          opacity="0.4"
        />

        {/* Eye — outer shape */}
        <ellipse
          cx="24"
          cy="22"
          rx="7"
          ry="4.5"
          stroke="#C9A84C"
          strokeWidth="1"
          fill="none"
        />

        {/* Eye — iris */}
        <circle
          cx="24"
          cy="22"
          r="2.5"
          fill="#C9A84C"
          opacity="0.85"
        />

        {/* Eye — pupil (dark center) */}
        <circle
          cx="24"
          cy="22"
          r="1.1"
          fill="#0A0608"
        />

        {/* Crescent moon as pupil accent */}
        <path
          d="M23.2 21.2 Q22.2 22 23.2 22.8"
          stroke="#E8C97A"
          strokeWidth="0.6"
          fill="none"
          strokeLinecap="round"
          opacity="0.7"
        />

        {/* Small stars on card */}
        <circle cx="16" cy="10" r="0.8" fill="#C9A84C" opacity="0.6" />
        <circle cx="32" cy="10" r="0.8" fill="#C9A84C" opacity="0.6" />
        <circle cx="24" cy="8" r="1" fill="#C9A84C" opacity="0.5" />

        {/* Bottom decoration — three dots */}
        <circle cx="20" cy="37" r="1" fill="#C9A84C" opacity="0.5" />
        <circle cx="24" cy="37" r="1" fill="#C9A84C" opacity="0.7" />
        <circle cx="28" cy="37" r="1" fill="#C9A84C" opacity="0.5" />
      </svg>

      {showText && (
        <div className={styles.text}>
          <span className={styles.name}>GURGORPISTER</span>
        </div>
      )}
    </div>
  );
}
