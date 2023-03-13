import React from 'react';
import propTypes from 'prop-types';
import { Checkbox, FormControlLabel, FormGroup, Menu } from '@mui/material';
import { Button } from 'reactstrap';

const ITEM_HEIGHT = 48;

function ShowHideColumn({ columns = [], setColumns }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, index) => {
    const currentConfig = [...columns];
    currentConfig[index].hide = !event.target.checked;
    setColumns(currentConfig);
  };

  return (
    <React.Fragment>
      <Button onClick={handleClick}>Ẩn/Hiện</Button>

      <Menu
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 12,
            width: '200px',
          },
        }}
      >
        <FormGroup className='p-2'>
          {columns.map((item, index) => (
            <FormControlLabel
              label={item?.headerName}
              key={item?.field}
              control={<Checkbox checked={!item.hide} />}
              onChange={(event) => handleChange(event, index)}
            />
          ))}
        </FormGroup>
      </Menu>
    </React.Fragment>
  );
}

ShowHideColumn.propTypes = {
  columns: propTypes.array,
  setColumns: propTypes.func,
};

export default React.memo(ShowHideColumn);
