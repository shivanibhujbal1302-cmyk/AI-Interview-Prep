// A grey pulsing placeholder shown while data loads.
export default function Skeleton({ height = 16, width = '100%', radius = 8, className = '' }) {
  return <div className={`skeleton ${className}`} style={{ height, width, borderRadius: radius }} aria-hidden="true" />;
}
