import React from 'react'
import  PropTypes  from 'prop-types'
import { Pagination } from 'reactstrap'


Pagination.PropTypes = {
  pagination: PropTypes.object.isRequired,
  onPageChange: PropTypes.func,
}

Pagination.defaultProps = {
  onPageChange: null,
}

function Pagination(props) {
  const {pagination, onPageChange} = props
  const {current_page, limit, total_page} = pagination

  function handlePageChange(newPage) {
    if (onPageChange) {
      onPageChange(newPage)
    }
  }

  return (
    <div>
      <button
        disabled={current_page <= 1}
        onClick={() => handlePageChange(current_page -1)}
      >
        Prev
      </button>  

      <button
        disabled={current_page >= total_page}
        onClick={() => handlePageChange(current_page +1)}
      >
        Next
      </button> 
    </div>
  )
}

export default Pagination