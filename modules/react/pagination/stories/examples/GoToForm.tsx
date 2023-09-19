import * as React from 'react';
import {
  Pagination,
  getLastPage,
  getVisibleResultsMax,
  getVisibleResultsMin,
} from '@workday/canvas-kit-react/pagination';
import {useUniqueId} from '@workday/canvas-kit-react/common';
import {Tooltip} from '../../../tooltip';

export const GoToForm = () => {
  const resultCount = 10;
  const totalCount = 100;
  const lastPage = getLastPage(resultCount, totalCount);
  const myId = useUniqueId();

  return (
    <Pagination
      onPageChange={pageNumber => console.log(pageNumber)}
      aria-label="Pagination"
      lastPage={lastPage}
    >
      <Pagination.Controls>
        <Tooltip title="First">
          <Pagination.JumpToFirstButton />
        </Tooltip>
        <Tooltip title="Previous">
          <Pagination.StepToPreviousButton />
        </Tooltip>
        <Pagination.PageList>
          {({state}) =>
            state.range.map(pageNumber => (
              <Pagination.PageListItem key={pageNumber}>
                <Tooltip title={`Page ${pageNumber}`}>
                  <Pagination.PageButton pageNumber={pageNumber} />
                </Tooltip>
              </Pagination.PageListItem>
            ))
          }
        </Pagination.PageList>
        <Tooltip title="Next">
          <Pagination.StepToNextButton />
        </Tooltip>
        <Tooltip title="Last">
          <Pagination.JumpToLastButton />
        </Tooltip>
        <Pagination.GoToForm>
          <Tooltip title="Go to page">
            <Pagination.GoToTextInput aria-label="Go to page" aria-describedby={myId} />
          </Tooltip>
          <Pagination.GoToLabel id={myId}>
            {({state}) => `of ${state.lastPage} pages`}
          </Pagination.GoToLabel>
        </Pagination.GoToForm>
      </Pagination.Controls>
      <Pagination.AdditionalDetails shouldHideDetails>
        {({state}) =>
          `${getVisibleResultsMin(state.currentPage, resultCount)}-${getVisibleResultsMax(
            state.currentPage,
            resultCount,
            totalCount
          )} of ${totalCount} results`
        }
      </Pagination.AdditionalDetails>
    </Pagination>
  );
};
