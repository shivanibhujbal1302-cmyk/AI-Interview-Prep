// One coloured section of the AI feedback (e.g. "What you did well").
// Pass `items` for a bullet list, or `children` for custom content.
export default function FeedbackCard({ title, icon: Icon, tone = 'neutral', items, children }) {
  return (
    <section className={`feedback-card feedback-card--${tone}`}>
      <h3 className="feedback-card__title">
        {Icon && <Icon size={18} aria-hidden="true" />}
        {title}
      </h3>
      {items && (
        <ul className="feedback-card__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {children}
    </section>
  );
}
