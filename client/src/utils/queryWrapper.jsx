const QueryWrapper = ({
  data,
  error,
  isLoading,
  isFetching,
  children,
}) => {
  // 🚨 Full offline fallback (no cache)
  if (error?.status === "OFFLINE" && !data) {
    return <OfflinePage />;
  }

  return (
    <>
      {/* 🔥 Offline banner */}
      {!navigator.onLine && (
        <div className="bg-red-500 text-white text-center">
          You are offline (showing cached data)
        </div>
      )}

      {/* ⏳ Loading */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        children(data)
      )}

      {/* 🔄 Background refetch */}
      {isFetching && <p>Refreshing...</p>}
    </>
  );
};

export default QueryWrapper;