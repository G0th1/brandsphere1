export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="h-16 w-16 relative animate-pulse">
          <div className="absolute inset-0 rounded-full border-t-2 border-primary"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary rotate-45"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary rotate-90"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary rotate-180"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-primary animate-spin"></div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Laddar...</p>
      </div>
    </div>
  )
} 