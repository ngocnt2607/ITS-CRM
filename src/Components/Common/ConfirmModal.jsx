import React from 'react';
import { Button, Modal, ModalHeader } from 'reactstrap';

export default function ConfirmModal({
  isOpen,
  title,
  onClick,
  close,
  header,
  content,
  buttonText = 'Submit',
  type = 'warning', //Use danger, success or warning
}) {
  return (
    <Modal
      isOpen={isOpen}
      toggle={close}
      id='confirm-modal'
      centered
      modalClassName='flip'
    >
      <ModalHeader>
        {header}
        <Button
          type='button'
          className='btn-close'
          onClick={close}
          aria-label='Close'
        ></Button>
      </ModalHeader>
      <div className='modal-body text-center p-5'>
        <lord-icon
          src='https://cdn.lordicon.com/tdrtiskw.json'
          trigger='loop'
          colors='primary:#ffbe0b,secondary:#4b38b3'
          style={{ width: '130px', height: '130px' }}
        ></lord-icon>
        <div className='mt-4 pt-4'>
          <h4>{title}</h4>
          <p className='text-muted'>{content}</p>

          <Button color={type} onClick={onClick}>
            {buttonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
