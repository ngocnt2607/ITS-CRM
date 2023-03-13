import React from 'react';
import PropTypes from 'prop-types';

const SearchBar = ({ data, onSearch, placeholder = 'Search...' }) => {
  const onChange = (event) => {
    const newData = data.filter((item) => {
      let contain = false;
      for (const property in item) {
        if (
          item[property]
            ?.toString()
            ?.toLowerCase()
            .includes(event.target.value?.toLowerCase().trim())
        ) {
          contain = true;
          break;
        }
      }
      return contain;
    });
    onSearch(newData);
  };

  return (
    <div className='d-flex justify-content-sm-end'>
      <div className='search-box ms-2'>
        <input
          type='text'
          className='form-control search'
          placeholder={placeholder}
          onChange={onChange}
        />
        <i className='ri-search-line search-icon'></i>
      </div>
    </div>
  );
};

SearchBar.propTypes = {
  onSearch: PropTypes.func,
  data: PropTypes.array,
  placeholder: PropTypes.string,
};

export default React.memo(SearchBar);
