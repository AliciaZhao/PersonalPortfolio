export default function SectionHeader({ icon, title, subtitle }) {
  const Icon = icon;
  return (
    <div className="sectionHeader">
      <div>
        <div className="sectionTitle">{title}</div>
        {subtitle ? <div className="sectionSub">{subtitle}</div> : null}
      </div>
    </div>
  );
}
