export default function AccountActivationSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen gap-4 py-16 animate-pulse">
      
      {/* Title */}
      <div className="h-6 w-72 bg-gray-300 rounded" />

      {/* Form */}
      <div className="flex flex-col gap-6 lg:w-1/3 w-full">
        
        {/* Subtitle */}
        <div className="h-5 w-80 bg-gray-300 rounded" />

        {/* Field 1 */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 bg-gray-300 rounded" />
          <div className="h-10 w-full bg-gray-300 rounded" />
        </div>

        {/* Field 2 */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-40 bg-gray-300 rounded" />
          <div className="h-10 w-full bg-gray-300 rounded" />
        </div>

        {/* Error placeholder */}
        <div className="h-4 w-52 bg-gray-300 rounded" />

        {/* Button */}
        <div className="h-10 w-full bg-gray-300 rounded" />
      </div>
    </div>
  );
}