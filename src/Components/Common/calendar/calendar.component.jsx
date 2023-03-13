import { useFormikContext } from 'formik';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import PropTypes from 'prop-types';
import * as moment from 'moment';

function Calendar({
  onChange,
  name,
  mode = 'range',
  dateFormat = 'Y-m-d',
  placeholder,
}) {
  const { errors, touched, setFieldValue, setFieldTouched, values } =
    useFormikContext();

  const handleChange = (value) => {
    if (value?.length === 2) {
      setFieldValue(name, {
        startDate: moment(value[0]).format('YYYY-MM-DD'),
        endDate: moment(value[1]).format('YYYY-MM-DD'),
      });
    } else {
      if (values[name]?.startDate || values[name]?.endDate) {
        setFieldValue(name, { startDate: '', endDate: '' });
      }
    }

    if (onChange) onChange();
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
        options={{
          mode,
          dateFormat,
        }}
      />

      {(!values[name]?.startDate || !values[name]?.endDate) &&
        touched[name] && (
          <p className='invalid-message'>{errors[name]?.startDate}</p>
        )}
    </>
  );
}

Calendar.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  mode: PropTypes.string,
  dateFormat: PropTypes.string,
  placeholder: PropTypes.string,
};

export default React.memo(Calendar);
