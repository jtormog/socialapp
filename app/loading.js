import { ChatBubbleLeftIcon } from "@heroicons/react/20/solid"

export default function Loading() {
    return (
        <div className="flex flex-col grow items-center gap-16 mt-28">
            {[1, 2, 3].map((index) => (
                <div key={index} className="flex flex-col gap-4 w-[600px] bg-white dark:bg-neutral-950 p-4 rounded-lg shadow-md animate-pulse">
                    <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
                        <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                        <div className="h-4 w-32 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    </div>

                    <div className="w-full flex justify-center">
                        <div className="w-full h-[600px] bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    </div>

                    <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                        <ChatBubbleLeftIcon className="w-8 text-gray-200 dark:text-neutral-800"/>
                    </div>

                    <div className="h-4 w-20 bg-gray-200 dark:bg-neutral-800 rounded"></div>

                    <div className="flex gap-2 items-center">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                        <div className="h-4 w-48 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    </div>

                    <div className="h-10 w-full bg-gray-200 dark:bg-neutral-800 rounded"></div>

                    <div className="space-y-4">
                        <div className="h-4 w-40 bg-gray-200 dark:bg-neutral-800 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}