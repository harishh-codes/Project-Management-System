export default function Pagination({ 
  currentPage = 1, 
  totalPages = 1, 
  onPageChange 
}) {
  const pages = []
    const start = Math.max(1, currentPage - 2)
    const end = Math.min(totalPages, currentPage + 2)

    for (let i = start; i <= end; i++) pages.push(i)

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(Math.max(1, currentPage - 1))} 
        disabled={currentPage === 1} 
        className="p-2 rounded-md border bg-white hover:bg-gray-50"
      >
          <ChevronLeft size={16} />
      </button>

      {startPage > 1 && (
        <>
          <button className="px-3 py-1 rounded-md border bg-white" onClick={() => onPageChange(1)}>1</button>
          {start > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg transition ${
            page === currentPage
              ? 'bg-primary text-white'
              : 'border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}

      {endPage < totalPages && (
        <>
          {end < totalPages && <span className="px-2">...</span>}
          <button className="px-3 py-1 rounded-md border bg-white" onClick={() => onPageChange(totalPages)}>{totalPages}</button>
        </>
      )}

      <button
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))} 
        disabled={currentPage === totalPages} 
        className="p-2 rounded-md border bg-white hover:bg-gray-50"
      >
          <ChevronRight size={16} />
      </button>
    </div>
  )
}
