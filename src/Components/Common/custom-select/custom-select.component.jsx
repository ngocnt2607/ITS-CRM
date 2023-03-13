import React from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { useFormikContext } from 'formik';
import { Label } from 'reactstrap';

const CustomSelect = ({
  options,
  isMulti = false,
  isAll = false,
  isDisabled = false,
  name,
  label,
  placeholder = 'Select...',
  onChange,
}) => {
  const generateOptions = useMemo(
    () =>
      isAll
        ? [{ label: 'Select All', value: 'all' }, ...options]
        : isMulti
        ? options
        : [{ label: '', value: '' }, ...options],
    [options, isAll, isMulti]
  );
  const { errors, touched, setFieldValue, setFieldTouched, values } =
    useFormikContext();

  const handleChange = (selectedOptions) => {
    if (isAll && selectedOptions.find((option) => option.value === 'all')) {
      setFieldValue(name, options);
    } else {
      const valueOption = isMulti ? selectedOptions?.[0] : selectedOptions;
      setFieldValue(
        name,
        valueOption?.value ? selectedOptions : isMulti ? [] : null
      );
    }
    //Single value
    if (onChange) onChange(selectedOptions.value);
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  return (
    <>
      {label && (
        <Label htmlFor={name} className='form-label'>
          {label}
        </Label>
      )}

      <Select
        id={name}
        name={name}
        options={generateOptions}
        isMulti={isMulti}
        onChange={handleChange}
        onBlur={handleBlur}
        isDisabled={isDisabled}
        value={values[name]}
        placeholder={placeholder}
      />
      {!!errors[name] && touched[name] && (
        <p className='invalid-message'>{errors[name]}</p>
      )}
    </>
  );
};

CustomSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  options: PropTypes.array,
  isMulti: PropTypes.bool,
  isAll: PropTypes.bool,
  onChange: PropTypes.func,
  isDisabled: PropTypes.bool,
};

export default React.memo(CustomSelect);
