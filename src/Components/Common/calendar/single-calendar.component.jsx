import { useFormikContext } from 'formik';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import PropTypes from 'prop-types';
import * as moment from 'moment';

function Calendar({ onChange, name, dateFormat = 'Y-m-d', placeholder }) {
  const { errors, touched, setFieldValue, setFieldTouched, values } =
    useFormikContext();

  const handleChange = (value) => {
    setFieldValue(name, value[0] ? moment(value[0]).format('YYYY-MM-DD') : '');

    if (onChange)
      onChange(value[0] ? moment(value[0]).format('YYYY-MM-DD') : '');
  };

  const handleBlur = () => {
    setFieldTouched(name, true);
  };

  return (
    <>
      <Flatpickr
        onChange={handleChange}
        className='form-control'
        placeholder={placeholder}
        onClose={handleBlur}
        value={values[name]}
        options={{
          mode: 'single',
          dateFormat,
        }}
      />

      {!values[name] && touched[name] && (
        <p className='invalid-message'>{errors[name]}</p>
      )}
    </>
  );
}

Calendar.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  dateFormat: PropTypes.string,
  placeholder: PropTypes.string,
};

export default React.memo(Calendar);
