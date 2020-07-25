interface IconProps {
  size?: string;
}

export function Book({ size = "24px" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Book open (outlined)</title>
      <g
        transform="matrix(
          1 0
          0 1
          1 2
        )"
      >
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M19 0C14.9 0 12.3 1.7 11 2.5C9.7 1.7 7.1 0 3 0L0 0L0 18L3 18C7.1 18 9.7 19.7 11 20.5C12.3 19.7 14.9 18 19 18L22 18L22 0L19 0ZM3 3C5.1 3 7.09999 3.60001 8.79999 4.70001L9.5 5.09998L9.5 16.3C7.5 15.4 5.3 15 3 15L3 3ZM19 15C16.7 15 14.5 15.5 12.5 16.3L12.5 5.09998L13.2 4.70001C14.9 3.60001 16.9 3 19 3L19 15Z"
          fill="currentColor"
          opacity="1"
        />
      </g>
    </svg>
  );
}

export function Logo({
  size = "24px",
  dark = false,
}: IconProps & { dark?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 201"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M89.9745 30.5439C95.445 25.0735 104.314 25.0735 109.785 30.5439L169.215 89.9745C174.686 95.445 174.686 104.314 169.215 109.785L109.785 169.215C104.314 174.686 95.445 174.686 89.9745 169.215L30.544 109.785C25.0735 104.314 25.0735 95.445 30.544 89.9745L89.9745 30.5439Z"
        fill={dark ? "black" : "white"}
      />
      <path
        d="M100.374 54.6022C100.374 50.9629 100.374 49.1433 101.092 48.3007C101.715 47.5696 102.65 47.1816 103.606 47.257C104.708 47.344 105.991 48.6307 108.558 51.204L153.416 96.1703C154.603 97.3598 155.196 97.9546 155.418 98.6404C155.614 99.2436 155.614 99.8935 155.418 100.497C155.196 101.183 154.603 101.777 153.416 102.967L108.558 147.933C105.991 150.506 104.708 151.793 103.606 151.88C102.65 151.955 101.715 151.567 101.092 150.836C100.374 149.994 100.374 148.174 100.374 144.535V54.6022Z"
        fill={dark ? "white" : "black"}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M118.47 8.46987C108.269 -1.73078 91.7308 -1.73078 81.5301 8.46987L7.65048 82.3495C-2.55016 92.5501 -2.55016 109.089 7.65049 119.289L81.5301 193.169C91.7308 203.37 108.269 203.37 118.47 193.169L192.35 119.289C202.55 109.089 202.55 92.5501 192.35 82.3495L118.47 8.46987ZM109.431 35.2349C104.331 30.1346 96.0613 30.1346 90.961 35.2349L35.5513 90.6446C30.451 95.7449 30.451 104.014 35.5513 109.114L90.961 164.524C96.0613 169.625 104.331 169.625 109.431 164.524L164.841 109.114C169.941 104.014 169.941 95.7449 164.841 90.6446L109.431 35.2349Z"
        fill={dark ? "white" : "black"}
      />
    </svg>
  );
}

export function Console({ size = "24px" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="matrix(
          1 0
          0 1
          1 1
        )"
      >
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M0 0L0 22L22 22L22 0L0 0ZM19 19L3 19L3 3L19 3L19 19Z"
          fill="currentColor"
          opacity="1"
        />
      </g>
      ,
      <g
        transform="matrix(
          1 0
          0 1
          5.9404296875 5.93994140625
        )"
      >
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M2.12 9.12L6.68 4.56L2.12 0L0 2.12L2.44 4.56L0 7L2.12 9.12Z"
          fill="currentColor"
          opacity="1"
        />
      </g>
    </svg>
  );
}

export function Figma({ size = "24px" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="matrix(
          1 0
          0 1
          5 1
        )"
      >
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M15 4.5C15 2.02 12.98 0 10.5 0L9 0L6 0L4.5 0C2.02 0 0 2.02 0 4.5C0 5.65 0.43 6.7 1.16 7.5C0.43 8.3 0 9.35 0 10.5C0 11.65 0.43 12.7 1.16 13.5C0.43 14.3 0 15.35 0 16.5C0 18.98 2.02 21 4.5 21C6.98 21 9 18.98 9 16.5L9 15L9 14.74C9.47 14.91 9.97 15 10.5 15C12.98 15 15 12.98 15 10.5C15 9.35 14.57 8.3 13.84 7.5C14.57 6.7 15 5.65 15 4.5ZM3 4.5C3 3.67 3.67 3 4.5 3L6 3L6 6L4.5 6C3.67 6 3 5.33 3 4.5ZM3 10.5C3 9.67 3.67 9 4.5 9L6 9L6 12L4.5 12C3.67 12 3 11.33 3 10.5ZM6 16.5C6 17.33 5.33 18 4.5 18C3.67 18 3 17.33 3 16.5C3 15.67 3.67 15 4.5 15L6 15L6 16.5ZM12 10.5C12 11.33 11.33 12 10.5 12C9.67 12 9 11.33 9 10.5C9 9.67 9.67 9 10.5 9C11.33 9 12 9.67 12 10.5ZM9 6L9 3L10.5 3C11.33 3 12 3.67 12 4.5C12 5.33 11.33 6 10.5 6L9 6Z"
          fill="currentColor"
          opacity="1"
        />
      </g>
    </svg>
  );
}

export function SearchIcon({ size = "16px" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        transform="matrix(
          1 0
          0 1
          1 0.899993896484375
        )"
      >
        <path
          fillRule="nonzero"
          clipRule="nonzero"
          d="M21.6001 19.5L17.2002 15.1C18.3002 13.5 19 11.6 19 9.50003C19 4.30003 14.7 0 9.5 0C4.3 0 0 4.30003 0 9.50003C0 14.7 4.3 19 9.5 19C11.6 19 13.5001 18.3 15.1001 17.2L19.5 21.6L21.6001 19.5ZM3 9.60001C3 6.00001 5.9 3.10001 9.5 3.10001C13.1 3.10001 16 6.00001 16 9.60001C16 13.2 13.1 16.1 9.5 16.1C5.9 16.1 3 13.2 3 9.60001Z"
          fill="currentColor"
          opacity="1"
        />
      </g>
    </svg>
  );
}
