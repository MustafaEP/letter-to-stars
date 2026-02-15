export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="h-10 bg-white/10 rounded-xl w-1/3"></div>
            <div className="h-6 bg-white/5 rounded-lg w-1/2"></div>
    
            {/* Content skeleton */}
            <div className="space-y-4 mt-8">
                <div className="h-5 bg-white/10 rounded-lg"></div>
                <div className="h-5 bg-white/10 rounded-lg"></div>
                <div className="h-5 bg-white/10 rounded-lg w-5/6"></div>
            </div>
    
            {/* Card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                <div className="h-48 bg-white/5 rounded-2xl border border-white/10"></div>
                <div className="h-48 bg-white/5 rounded-2xl border border-white/10"></div>
            </div>
        </div>
    );
}