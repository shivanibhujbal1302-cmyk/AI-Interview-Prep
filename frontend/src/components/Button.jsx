import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

// One button for the whole app.
//   variant: primary | secondary | ghost | danger | light
//   size:    sm | md | lg
//   to="/path"   -> renders a router link that looks like a button
//   href="#id"   -> renders a normal anchor (for in-page scrolling)
//   loading      -> shows a spinner and disables the button
export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  loading = false,
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  children,
  ...props
}) {
  const classes = ['btn', `btn--${variant}`, `btn--${size}`, fullWidth ? 'btn--full' : '', className]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="spin" size={18} aria-hidden="true" />}
      {children}
    </button>
  );
}
