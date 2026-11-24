// A row of mutually exclusive choices (like radio buttons, but prettier).
// options: [{ value, label, icon? }]
export default function SegmentedControl({ label, options, value, onChange }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((option) => {
        const Icon = option.icon;
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            className={`segmented__option ${selected ? 'segmented__option--selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            {Icon && <Icon size={16} aria-hidden="true" />}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
