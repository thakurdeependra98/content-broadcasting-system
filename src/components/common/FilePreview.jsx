/**
 * @param {{ src: string, alt: string, className?: string }} props
 */
export function FilePreview({ src, alt, className }) {
  if (!src) return null
  return (
    <div
      className={`overflow-hidden rounded-md border bg-muted/30 ${className ?? ''}`}
    >
      <img
        src={src}
        alt={alt}
        className="max-h-64 w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}
