import { useFormikContext } from 'formik';
import React from 'react';
import { FormFeedback, Input, Label } from 'reactstrap';
import PropTypes from 'prop-types';

function CustomInput({
  name,
  placeholder = 'Enter...',
  onChange,
  label,
  disabled,
  type = 'text',
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

      <Input
        name={name}
        className='form-control'
        placeholder={placeholder}
        onChange={handleChange}
        type={type}
        value={values[name]}
        onBlur={() => setFieldTouched(name, true)}
        invalid={touched[name] && errors[name] ? true : false}
        disabled={disabled}
      />
      {touched[name] && errors[name] ? (
        <FormFeedback type='invalid'>{errors[name]}</FormFeedback>
      ) : null}
    </>
  );
}

CustomInput.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default React.memo(CustomInput);