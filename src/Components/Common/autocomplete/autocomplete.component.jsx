import { Autocomplete, TextField } from '@mui/material';
import { useFormikContext } from 'formik';
import React, { useState } from 'react';
import { convertStringToArray } from '../../../helpers/array.helper';
import PropTypes from 'prop-types';
import './autocomplete.style.scss';

function AutocompleteController(props) {
  const {
    name,
    placeholder,
    options,
    multiple,
    defaultValue,
    freeSolo,
    limitTags,
    disable,
    isError,
    className,
  } = props;
  const { setFieldTouched, setFieldValue, values, errors, touched } =
    useFormikContext();

  const [valueInput, setValueInput] = useState('');

  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      size='small'
      className='auto-complete'
      defaultValue={defaultValue}
      limitTags={limitTags}
      disabled={disable}
      freeSolo={freeSolo}
      value={values[name]}
      inputValue={valueInput}
      onBlur={() => setFieldTouched(true)}
      onInputChange={(event, newInputValue) => {
        let options = convertStringToArray(newInputValue);

        if (options.length > 1) {
          options = options.map((item) => item.trim()).filter((item) => item);
          setFieldValue(name, values[name].concat(options));
          setValueInput('');
        } else {
          setValueInput(newInputValue?.trim());
        }
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          className={className}
          variant='outlined'
          placeholder={placeholder}
          error={isError || (errors[name] && touched[name])}
          helperText={errors[name] || ''}
        />
      )}
      onChange={(e, value) => setFieldValue(name, value)}
    />
  );
}

AutocompleteController.propTypes = {
  placeholder: PropTypes.string,
  multiple: PropTypes.bool,
  freeSolo: PropTypes.bool,
  defaultValue: PropTypes.array,
  limitTags: PropTypes.number,
  disable: PropTypes.bool,
  isError: PropTypes.bool,
  className: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
};

AutocompleteController.defaultProps = {
  placeholder: '',
  multiple: false,
  freeSolo: false,
  defaultValue: [],
  limitTags: 4,
  disable: false,
  isError: false,
  className: '',
};

export default React.memo(AutocompleteController);
