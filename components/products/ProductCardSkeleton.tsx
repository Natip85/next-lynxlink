export default function ProductCardSkeleton() {
  return (
    <div className="relative animate-pulse">
      <div className="aspect-square w-full overflow-hidden rounded-md bg-secondary lg:aspect-none lg:h-80">
        <div className="h-full w-full bg-secondary" />
      </div>
      <div className="mt-4 flex flex-col gap-2">
        <div className="bg-secondary h-4 w-full" />
        <div className="bg-secondary h-4 w-full" />
      </div>
    </div>
  );
}
