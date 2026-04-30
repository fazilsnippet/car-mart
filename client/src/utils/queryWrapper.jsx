const QueryWrapper = ({
  data,
  error,
  isLoading,
  isFetching,
  children,
}) => {
  const hasData = data && Object.keys(data).length > 0;

  // 🚨 Full offline fallback (only if no data at all)
  if (error && !hasData) {
    return <OfflinePage />;
  }

  return (
    <>
      {/* 🔥 Offline banner (only if cached data exists) */}
      {error && hasData && (
        <div className="text-center text-white bg-red-500">
          You are offline (showing cached data)
        </div>
      )}

      {/* ⏳ Initial loading */}
      {isLoading && !hasData ? (
        <p>Loading...</p>
      ) : (
        children(data)
      )}

      {/* 🔄 Background refetch */}
      {isFetching && hasData && (
        <p className="text-sm text-center text-gray-500">
          Updating results...
        </p>
      )}
    </>
  );
};

export default QueryWrapper;