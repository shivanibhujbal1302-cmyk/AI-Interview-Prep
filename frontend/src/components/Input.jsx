import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// A labelled text field with an optional icon, hint, and error message.
// Password fields automatically get a "show / hide" button.
export default function Input({ label, type = 'text', error, hint, icon: Icon, className = '', ...props }) {
  const id = useId();
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;
  const messageId = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={`field ${error ? 'field--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      )}
      <div className="field__control">
        {Icon && <Icon className="field__icon" size={18} aria-hidden="true" />}
        <input
          id={id}
          type={inputType}
          className={`field__input ${Icon ? 'field__input--icon' : ''}`}
          aria-invalid={Boolean(error)}
          aria-describedby={messageId}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle"
            onClick={() => setShowPassword((visible) => !visible)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="field__error" role="alert">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="field__hint">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
