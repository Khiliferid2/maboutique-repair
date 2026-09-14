export default function Logo({ size = 32 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-icon.png"
      alt="MaBoutique Repair"
      width={size}
      height={size}
      className="shrink-0"
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}
