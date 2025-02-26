export default function Loading() {
    return (
        <div className="container py-8 relative ml-auto">
            <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col md:flex-row items-center gap-8 w-full max-w-2xl">
                    <div className="w-[150px] h-[150px] rounded-full bg-gray-200 dark:bg-neutral-800 animate-pulse"></div>
                    <div className="flex flex-col gap-4 text-center md:text-left">
                        <div className="h-9 w-48 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                        <div className="flex flex-wrap gap-8 justify-center md:justify-start">
                            <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                            <div className="h-6 w-24 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-6xl">
                    {[1, 2, 3, 4, 5, 6].map((index) => (
                        <div key={index} className="aspect-square bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse"></div>
                    ))}
                </div>
            </div>
        </div>
    );
}