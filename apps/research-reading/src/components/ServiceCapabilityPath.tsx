interface ServiceCapabilityPathProps {
  product: 'research' | 'reading'
  items: readonly string[]
}

export function ServiceCapabilityPath({ product, items }: ServiceCapabilityPathProps) {
  return (
    <div className={`service-capability-path service-capability-path--${product}`} role="group" aria-label="功能路径">
      <span className="service-capability-path__label">功能路径</span>
      <ol>
        {items.map((item, index) => (
          <li className={index < 2 ? 'is-foundation' : undefined} key={item}>
            <span>{item}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
