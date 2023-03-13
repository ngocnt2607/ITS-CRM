import { useFormikContext } from 'formik';
import React from 'react';
import { FormFeedback, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

function CustomInputNumber({
  name,
  placeholder = 'Enter...',
  onChange,
  label,
  disabled,
  isDisabled = false,
  type = 'text',
}) {
  const { errors, touched, setFieldValue, setFieldTouched, values } =
    useFormikContext();

  const handleChange = (event) => {
    const formattedValue = event.target.value.replace(/[,]+/g, "");
    setFieldValue(name, formattedValue);
    onChange && onChange(formattedValue);
  };

  return (
    <>
      {label && (
        <Label htmlFor={name} className='form-label'>
          {label}
        </Label>
      )}

      <Input
        name={name}
        className='form-control'
        placeholder={placeholder}
        onChange={handleChange}
        type={type}
        value={parseFloat(values[name]).toLocaleString()}
        onBlur={() => setFieldTouched(name, true)}
        invalid={touched[name] && errors[name] ? true : false}
        disabled={disabled}
        isDisabled={isDisabled}
      />
      {touched[name] && errors[name] ? (
        <FormFeedback type='invalid'>{errors[name]}</FormFeedback>
      ) : null}
    </>
  );
}

CustomInputNumber.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default React.memo(CustomInputNumber);



