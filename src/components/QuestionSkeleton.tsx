function QuestionSkeleton() {
  return (
    <div className="bg-white/90 rounded-xl p-6 shadow animate-pulse">
      <div className="h-5 bg-gray-300 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>

      <div className="flex gap-2 mt-4">
        <div className="h-6 w-14 bg-blue-200 rounded-full"></div>
        <div className="h-6 w-16 bg-blue-200 rounded-full"></div>
        <div className="h-6 w-12 bg-blue-200 rounded-full"></div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
        <div className="h-4 w-20 bg-gray-200 rounded"></div>
        <div className="h-4 w-16 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
}

export default QuestionSkeleton;
