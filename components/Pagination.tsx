import React from "react";

type PaginationProps = {
  postPerPage: number;
  currentPage: number;
  totalPosts: number;
  paginate: (pageNumber: number) => void;
  setPostsPerPage?: (val: number) => void;
};

export const Pagination: React.FC<PaginationProps> = ({
  postPerPage,
  currentPage,
  totalPosts,
  paginate,
  setPostsPerPage,
}) => {
  const pageNumbers: number[] = [];
  const totalPage = Math.ceil(totalPosts / postPerPage);

  let startNumber = currentPage;
  if (startNumber - 4 < 1) {
    startNumber = 1;
  } else if (startNumber + 3 > totalPage) {
    startNumber = totalPage - 4;
  } else {
    startNumber = currentPage - 2;
  }

  for (let i = 1; i <= totalPage && pageNumbers.length < 5; i++) {
    pageNumbers.push(startNumber++);
  }

  const onChangePerPage = (val: string) => {
    const num = parseInt(val, 10);
    setPostsPerPage?.(num);
    paginate(1);
  };

  return (
    <nav className="w-full flex flex-col md:flex-row items-center md:justify-between gap-3">
      <div>
        {setPostsPerPage && (
          <select
            onChange={(e) => onChangePerPage(e.target.value)}
            className="border-2 border-admin py-1 md:py-2 px-2 md:px-5 rounded-xl bg-transparent text-sm md:text-base"
            value={postPerPage}
          >
            {[5, 10, 20, 50].map((val) => {
              return (
                <option
                  key={val}
                  value={val}
                  className="bg-[var(--background)]"
                >
                  แสดง {val} แถว
                </option>
              );
            })}
          </select>
        )}
      </div>

      <div>
        <ul className="flex">
          <li>
            <button
              className={`border-2 border-admin rounded-full mr-1 lg:mr-3 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-base ${
                currentPage === 1 &&
                "disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-800 disabled:border-gray-200"
              }`}
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>
          </li>

          {currentPage > 4 && totalPage > 5 && (
            <>
              <li>
                <button
                  className="border-2 border-admin rounded-full lg:mx-1 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-base"
                  onClick={() => paginate(1)}
                >
                  {1}
                </button>
              </li>
              <li>
                <p className="lg:mx-1 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-xl font-extrabold flex items-end justify-center">
                  ...
                </p>
              </li>
            </>
          )}

          {pageNumbers.length > 0 ? (
            pageNumbers.map((number) => (
              <li key={number}>
                <button
                  className={`border-2 border-admin rounded-full mx-1 h-6 lg:h-10 w-6 lg:w-10 text-xs lg:text-base ${
                    currentPage === number
                      ? "bg-[var(--gray)]"
                      : "text-admin"
                  }`}
                  onClick={() => paginate(number)}
                >
                  {number}
                </button>
              </li>
            ))
          ) : (
            <li>
              <button
                className="border-2 border-admin rounded-full mx-1 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-base"
                disabled
              >
                1
              </button>
            </li>
          )}

          {(currentPage + 2 < totalPage || currentPage === 4) &&
            totalPage > 5 && (
              <>
                <li>
                  <p className="lg:mx-1 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-xl font-extrabold flex items-end justify-center">
                    ...
                  </p>
                </li>
                <li>
                  <button
                    className="border-2 border-admin rounded-full lg:mx-1 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-base"
                    onClick={() => paginate(totalPage)}
                  >
                    {totalPage}
                  </button>
                </li>
              </>
            )}

          <li>
            <button
              className={`border-2 border-admin rounded-full ml-1 lg:ml-3 h-6 lg:h-10 w-6 lg:w-10 text-admin text-xs lg:text-base ${
                currentPage >= totalPage &&
                "disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-800 disabled:border-gray-200"
              }`}
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= totalPage}
            >
              {">"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};
