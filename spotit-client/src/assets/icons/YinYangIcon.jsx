const YinYangIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 128 128"
    {...props}
  >
    <circle
      cx={64}
      cy={64}
      r={61.5}
      fill="#2f2f2f"
      stroke="#464747"
      strokeMiterlimit={10}
      strokeWidth={4}
    />
    <g stroke="#4589f1" strokeMiterlimit={10} strokeWidth={8}>
      <circle cx={64} cy={64} r={48.47} fill="none" />
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M64 7.43v113.14M24 24l80 80M7.43 64h113.14M24 104l80-80"
      />
      <circle cx={64} cy={64} r={10.09} fill="#fff" />
    </g>
    <circle
      cx={64}
      cy={64}
      r={61.5}
      fill="#2f2f2f"
      className="dark:fill-cardIcons-dark-primary2"
    />
    <circle
      cx={34.48}
      cy={64.02}
      r={7.15}
      fill="#fff"
      className="dark:fill-cardIcons-dark-tertiary"
    />
    <path
      fill="#fff"
      className="dark:fill-cardIcons-dark-tertiary"
      d="M10.08 64c-.02-29.78 24.11-53.93 53.88-53.95c29.78-.02 53.93 24.1 53.95 53.88c.01 14.89-12.05 26.97-26.94 26.98c-14.88.01-26.31-11.97-26.97-26.95c-.65-14.73-12.09-26.95-26.98-26.94S10.07 49.11 10.08 64"
    />
    <circle cx={93.52} cy={63.98} r={7.15} fill="#2f2f2f" />
  </svg>
);
export default YinYangIcon;
