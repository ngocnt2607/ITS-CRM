import React, { useState } from 'react';
import { DataGrid, GridApiContext } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import './data-grid.style.scss';
import { Button, Modal, ModalHeader, Spinner } from 'reactstrap';
import clsx from 'clsx';
import { Pagination, Stack } from '@mui/material';

export function NewToolbar({ handleDelete }) {
  const gridContext = React.useContext(GridApiContext);
  const state = gridContext?.current?.state;
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleMultipleDelete = async () => {
    setIsLoading(true);
    await handleDelete(state?.selection);
    setIsLoading(false);
    setIsOpen(false);
  };

  return (
    <div style={{ float: 'right' }}>
      <Button
        color='danger'
        onClick={() => setIsOpen(true)}
        disabled={!state?.selection?.length}
      >
        Xóa nhiều
      </Button>

      <Modal
        isOpen={isOpen}
        toggle={() => setIsOpen(false)}
        id='firstmodal'
        modalClassName='flip'
        centered
      >
        <ModalHeader>
          Xóa nhiều bản ghi
          <Button
            type='button'
            className='btn-close'
            onClick={() => setIsOpen(false)}
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
            <h4>Xóa nhiều bản ghi?</h4>
            <p className='text-muted'>
              {' '}
              Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa bản
              ghi này?
            </p>

            <Button color='danger' onClick={handleMultipleDelete}>
              {isLoading && <Spinner size='sm' style={{ marginRight: 3 }} />}
              Xóa
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const CustomDataGrid = (props) => {
  const {
    rows,
    columns,
    pageSize = 50,
    isBreakText = false,
    onMultipleDelete,
    handleChangePage,
    totalPage,
    page,
    isDisplayPagination = false,
  } = props;
  const isMultipleSelect = !!onMultipleDelete;

  return (
    <>
      <div className='data-grid'>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={pageSize}
          rowsPerPageOptions={[50]}
          className={clsx({ 'break-text': isBreakText })}
          disableColumnMenu
          rowHeight={47}
          hideFooter={isDisplayPagination}
          hideFooterSelectedRowCount
          checkboxSelection={isMultipleSelect}
          disableSelectionOnClick={isMultipleSelect}
          components={{
            Toolbar: isMultipleSelect ? NewToolbar : null,
          }}
          componentsProps={{
            toolbar: isMultipleSelect
              ? {
                  handleDelete: onMultipleDelete,
                }
              : null,
          }}
        />
      </div>

      {isDisplayPagination && (
        <Stack direction='row' justifyContent='flex-end' marginTop={1}>
          <Pagination
            count={totalPage}
            onChange={(e, page) => handleChangePage(page)}
            variant='outlined'
            color='primary'
            page={page}
          />
        </Stack>
      )}
    </>
  );
};

CustomDataGrid.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
  pageSize: PropTypes.number,
  onMultipleDelete: PropTypes.func,
  isBreakText: PropTypes.bool,
  handleChangePage: PropTypes.func,
  totalPage: PropTypes.number,
  isDisplayPagination: PropTypes.bool,
  page: PropTypes.number,
};

export default React.memo(CustomDataGrid);
