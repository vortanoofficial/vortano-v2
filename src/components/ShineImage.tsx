import Image from "next/image";

/**
 * A logo image with a gold shine that sweeps across it.
 * The moving highlight is masked to the artwork's own alpha (via `src`),
 * so the shine only travels over the logo, not its bounding box.
 */
export function ShineImage({
  src,
  alt,
  width,
  height,
  className,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <span className="logo-shine">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={className}
      />
      <span
        className="logo-shine__sweep"
        aria-hidden
        style={{ WebkitMaskImage: `url(${src})`, maskImage: `url(${src})` }}
      />
    </span>
  );
}
