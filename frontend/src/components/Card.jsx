// A white rounded box. Used everywhere to group content.
export default function Card({ as: Tag = 'div', hover = false, className = '', children, ...props }) {
  return (
    <Tag className={`card ${hover ? 'card--hover' : ''} ${className}`} {...props}>
      {children}
    </Tag>
  );
}
