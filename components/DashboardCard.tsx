type DashboardCardProps = {
  title: string;
  description: string;
};

export function DashboardCard({ title, description }: DashboardCardProps) {
  return (
    <article className="rounded-lg border p-4 shadow-sm">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-gray-600">{description}</p>
    </article>
  );
}
