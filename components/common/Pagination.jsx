/* This example requires Tailwind CSS v2.0+ */
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}


const genSeries = (start, end, max) => {
  let series = [];
  let count  = 0;

  for(let i = start; i <= end; i++){
      if(count !== max){
          series.push(i);
      }
      else{
          break;
      }
      count++;
  }

  return series;
}

export default function Example({ totalPages, currentPage, onPageChange, totalResults, resultsOnPage }) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
  const pageNumberLimit = 10; 

  const handlePrevClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  const handlePrevSection = () => {
    const page = currentPage - pageNumberLimit;
    // setCurrentPage(page);
    onPageChange(page);
  };

  const handleNextSection = () => {
    const page = currentPage + pageNumberLimit;
    // setCurrentPage(page);
    onPageChange(page);
  };

  // const pageNumbers = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   pageNumbers.push(i);
  // }

  const start = currentPage % pageNumberLimit === 1 || currentPage % pageNumberLimit === 0 ? currentPage : (currentPage - (currentPage % pageNumberLimit)) + 1;
  const end = currentPage % pageNumberLimit === 1 || currentPage % pageNumberLimit === 0 ? currentPage + pageNumberLimit -1 :  (currentPage + pageNumberLimit) - (currentPage%pageNumberLimit);
  const visiblePageNumbers = pageNumbers.slice(start - 1, end);
  
  console.log("Start: ", start); 
  console.log("end: ", end); 
  console.log("currentPage: ", currentPage); 

  return (
    <div className="flex items-center justify-between border-gray-200 bg-white px-4 py-3 sm:px-6 w-full">
      <div className="flex flex-1 justify-between sm:hidden">
        <a
          href="#"
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={handlePrevClick} disabled={currentPage === 1}
        >
          Previous
        </a>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          onClick={handleNextClick} disabled={currentPage === totalPages}
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">{resultsOnPage}</span> of{' '}
            <span className="font-medium">{totalResults}</span> results
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">

            {
              currentPage > pageNumberLimit &&
              <a
                href="#"
                className="mr-2relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={handlePrevSection} disabled={currentPage === 1}
              >
                <span className="sr-only">Previous</span>
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            }
            

            <a
              href="#"
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              onClick={handlePrevClick} disabled={currentPage === 1}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </a>

            {visiblePageNumbers.map((pageNumber) => (
                <a
                  href='#'
                  key={pageNumber}
                  aria-current="page"
                  className={
                    classNames("relative z-10 inline-flex items-center border px-4 py-2 text-sm font-medium focus:z-20", pageNumber === currentPage && ' border border-indigo-500 text-indigo-600 bg-indigo-50' || "")
                  }
                  onClick={() => handlePageClick(pageNumber)}
                  disabled={pageNumber === currentPage}
                >
                  {pageNumber}
                </a>
            ))}

            <a
              href="#"
              className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
              onClick={handleNextClick} disabled={currentPage === totalPages}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </a>

            {
              currentPage + pageNumberLimit <= totalPages &&
              <a
                href="#"
                className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-20"
                onClick={handleNextSection} disabled={currentPage === totalPages}
              >
                <span className="sr-only">Next</span>
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
              </a>
            }
          </nav>
        </div>
      </div>
    </div>
  )
}