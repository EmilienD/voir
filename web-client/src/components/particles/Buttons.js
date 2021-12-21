export const Button = (props) => (
  <button
    {...props}
    className="rounded border-solid border-sky-500 text-white border-2 px-2 py-1 hover:shadow-white"
  ></button>
)
const MediaControlButton = (props) => (
  <button {...props} className="p-4 h-20 w-20"></button>
)

export const RecordButton = (props) => (
  <MediaControlButton {...props}>
    <svg
      version="1.1"
      viewBox="0 0 30.466 30.466"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-red-600"
    >
      <g transform="translate(-59.959 -82.697)">
        <path d="m60.059 96.186a15.233 15.233 0 0 1 16.442-13.433 15.233 15.233 0 0 1 13.899 16.05 15.233 15.233 0 0 1-15.645 14.353 15.233 15.233 0 0 1-14.796-15.227" />
      </g>
    </svg>
  </MediaControlButton>
)

export const PauseButton = (props) => (
  <MediaControlButton {...props}>
    <svg
      version="1.1"
      viewBox="0 0 30.466 30.466"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-black"
    >
      <g transform="translate(-59.959 -82.697)">
        <rect
          x="64.019"
          y="82.697"
          width="7.8672"
          height="30.466"
          ry="1.9886"
        />
        <rect
          x="78.001"
          y="82.697"
          width="7.8672"
          height="30.466"
          ry="1.9886"
        />
      </g>
    </svg>
  </MediaControlButton>
)

export const StopButton = (props) => (
  <MediaControlButton {...props}>
    <svg
      version="1.1"
      viewBox="0 0 30.466 30.466"
      xmlns="http://www.w3.org/2000/svg"
      className="fill-black"
    >
      <rect width="30.466" height="30.466" ry="1.9886" />
    </svg>
  </MediaControlButton>
)
