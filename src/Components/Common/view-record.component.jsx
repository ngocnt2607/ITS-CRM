import { DataGrid } from '@mui/x-data-grid';
import React from 'react';
import { Button, Modal, ModalHeader } from 'reactstrap';
import PropTypes from 'prop-types';

function ViewRecord({ data, config, isOpen, onClose, title, size = 'xl' }) {
  return (
    <Modal
      isOpen={isOpen}
      onClosed={onClose}
      modalClassName='flip'
      centered
      size={size}
    >
      <ModalHeader>
        {title}
        <Button
          type='button'
          onClick={onClose}
          className='btn-close'
          aria-label='Close'
        ></Button>
      </ModalHeader>
      <div className='modal-body' style={{ height: 200 }}>
        <DataGrid rows={data ? [data] : []} columns={config} hideFooter />
      </div>
    </Modal>
  );
}

ViewRecord.propTypes = {
  data: PropTypes.object,
  config: PropTypes.array,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  size: PropTypes.string,
};

export default React.memo(ViewRecord);
