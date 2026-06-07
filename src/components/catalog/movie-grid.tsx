interface MovieGridProps {
  children: React.ReactNode;
}

export function MovieGrid({ children }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {children}
    </div>
  );
}
