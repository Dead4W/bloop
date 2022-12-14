import IconWrapper from './Wrapper';

const RawIcon = (
  <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7.46968 7.46967C7.17678 7.76256 7.17678 8.23744 7.46968 8.53033C7.76257 8.82322 8.23745 8.82322 8.53034 8.53033L7.46968 7.46967ZM15 1L15.75 1C15.75 0.801088 15.671 0.610322 15.5303 0.46967C15.3897 0.329018 15.1989 0.25 15 0.25L15 1ZM11 0.250002L10.25 0.250002L10.25 1.75L11 1.75L11 0.250002ZM14.25 4.99999L14.25 5.74999L15.75 5.75L15.75 5L14.25 4.99999ZM8.53034 8.53033L15.5303 1.53033L14.4697 0.469671L7.46968 7.46967L8.53034 8.53033ZM15 0.25L11 0.250002L11 1.75L15 1.75L15 0.25ZM14.25 1L14.25 4.99999L15.75 5L15.75 1L14.25 1Z"
      fill="currentColor"
    />
    <path
      d="M8 1H4C2.34315 1 1 2.34315 1 4V12C1 13.6569 2.34315 15 4 15H12C13.6569 15 15 13.6569 15 12V8"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const BoxedIcon = (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.46968 9.46967C9.17678 9.76256 9.17678 10.2374 9.46968 10.5303C9.76257 10.8232 10.2374 10.8232 10.5303 10.5303L9.46968 9.46967ZM17 3L17.75 3C17.75 2.80109 17.671 2.61032 17.5303 2.46967C17.3897 2.32902 17.1989 2.25 17 2.25L17 3ZM13 2.25L12.25 2.25L12.25 3.75L13 3.75L13 2.25ZM16.25 6.99999L16.25 7.74999L17.75 7.75L17.75 7L16.25 6.99999ZM10.5303 10.5303L17.5303 3.53033L16.4697 2.46967L9.46968 9.46967L10.5303 10.5303ZM17 2.25L13 2.25L13 3.75L17 3.75L17 2.25ZM16.25 3L16.25 6.99999L17.75 7L17.75 3L16.25 3Z"
      fill="currentColor"
    />
    <path
      d="M10 3H6C4.34315 3 3 4.34315 3 6V14C3 15.6569 4.34315 17 6 17H14C15.6569 17 17 15.6569 17 14V10"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

export default IconWrapper(RawIcon, BoxedIcon);