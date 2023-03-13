import { useFormikContext } from 'formik';
import React from 'react';
import Flatpickr from 'react-flatpickr';
import PropTypes from 'prop-types';
import * as moment from 'moment';

function CalendarTime({
  onChange,
  name,
  mode = 'range',
  dateFormat = 'Y-m-d H:i',
  placeholder,
  
}) {
  const { errors, touched, setFieldValue, setFieldTouched, values } =
    useFormikContext();

  const handleChange = (value) => {
    if (value?.length === 2) {
      setFieldValue(name, {
        startDate: moment(value[0]).format('YYYY-MM-DD hh:mm'),
        endDate: moment(value[1]).format('YYYY-MM-DD hh:mm'),
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
          enableTime: true,
        }}
      />

      {(!values[name]?.startDate || !values[name]?.endDate) &&
        touched[name] && (
          <p className='invalid-message'>{errors[name]?.startDate}</p>
        )}
    </>
  );
}

CalendarTime.propTypes = {
  name: PropTypes.string,
  onChange: PropTypes.func,
  mode: PropTypes.string,
  dateFormat: PropTypes.string,
  placeholder: PropTypes.string,
};

export default React.memo(CalendarTime);
