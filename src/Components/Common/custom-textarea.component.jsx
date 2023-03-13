import { useFormikContext } from 'formik';
import React from 'react';
import { FormFeedback, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

function CustomTextarea({
  name,
  placeholder = 'Enter...',
  onChange,
  label,
  disabled,
  rows = 4,
  cols = 10,
}) {
  const { errors, touched, setFieldValue, setFieldTouched, values } =
    useFormikContext();

  const handleChange = (event) => {
    setFieldValue(name, event.target.value);
    onChange && onChange(event.target.value);
  };

  return (
    <>
      {label && (
        <Label htmlFor={name} className='form-label'>
          {label}
        </Label>
      )}

      <textarea
        name={name}
        className={`form-control ${touched[name] && errors[name] ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        onChange={handleChange}
        value={values[name]}
        onBlur={() => setFieldTouched(name, true)}
        // invalid={touched[name] && errors[name] ? true : false}
        disabled={disabled}
        rows={rows}
        cols={cols}
      />

      {touched[name] && errors[name] && (
        <FormFeedback type='invalid'>{errors[name]}</FormFeedback>
      )}
    </>
  );
}

CustomTextarea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  rows: PropTypes.number,
  cols: PropTypes.number,
};

export default React.memo(CustomTextarea);