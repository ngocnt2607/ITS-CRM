import React from 'react';
import CountUp from 'react-countup';
import PropTypes from 'prop-types';
import { isFloat } from '../../helpers/math.helper';

const Widgets = ({ widgets, data }) => {
  return (
    <React.Fragment>
      <div className='col-xl-12'>
        <div className='card crm-widget'>
          <div className='card-body p-0'>
            <div className='row row-cols-xxl-5 row-cols-md-3 row-cols-1 g-0'>
              {widgets.map((widget, index) => (
                <div className='col' key={index}>
                  <div className='py-4 px-3'>
                    <h5 className='text-muted text-uppercase fs-13'>
                      {widget.label}
                      <i
                        className={
                          widget.badge + ' fs-18 float-end align-middle'
                        }
                      ></i>
                    </h5>
                    <div className='d-flex align-items-center'>
                      <div className='flex-shrink-0'>
                        <i
                          className={widget.icon + ' display-6 text-muted'}
                        ></i>
                      </div>
                      <div className='flex-grow-1 ms-3'>
                        <h4 className='mb-0'>
                          <span className='counter-value' data-target='197'>
                            <CountUp
                              start={0}
                              prefix={widget.prefix || ''}
                              suffix={widget.suffix || ''}
                              separator=','
                              decimal='.'
                              decimals={isFloat(data[widget.id]) ? 2 : 0}
                              end={data[widget.id] || 0}
                              duration={1}
                            />
                          </span>
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

Widgets.propTypes = {
  widgets: PropTypes.array,
  data: PropTypes.object,
};

export default Widgets;
