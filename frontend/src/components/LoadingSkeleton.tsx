export default function LoadingSkeleton() {
    return (
        <div className="animate-pulse space-y-4">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
    
            {/* Content skeleton */}
            <div className="space-y-3 mt-8">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
    
            {/* Card skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            <div className="h-48 bg-gray-200 rounded-xl"></div>
            </div>
        </div>
    );
}