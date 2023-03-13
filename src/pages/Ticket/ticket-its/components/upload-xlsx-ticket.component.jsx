/* eslint-disable no-prototype-builtins */
import React from 'react';
import * as XLSX from 'xlsx';
import PropTypes from 'prop-types';
import addToast from '../../../../Components/Common/add-toast.component';

const UploadXLSXProps = {
  setXlsxData: PropTypes.func.isRequired,
};

//Row name
const ROW_NUMBER = 'number';
const ROW_CFU = 'cfu';

function UploadXLSX({ setXlsxData }) {
  const onImportExcel = async (event) => {
    event.preventDefault();
    const { files } = event.target;
    if (files.length === 1) {
      // Process a file if we have exact one
      const data = await readExcelFile(files[0]);
      const convertData = data.reduce(
        (prev, current) => {
          if (current.number) {
            prev.number.push(current[ROW_NUMBER]);
            prev.cfu.push(current[ROW_CFU] || '');
          }

          return prev;
        },
        { isdn: [], cfu: [] }
      );
      setXlsxData(convertData);
      return;
    }

    setXlsxData(null);
  };

  const readExcelFile = async (file) => {
    // Return a promise read file
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const { result } = event.target;
          const workbook = XLSX.read(result, { type: 'binary' });
          for (const Sheet in workbook.Sheets) {
            // var XL_row_object =
            const sheetName = 'Sheet1';
            XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
            if (workbook.Sheets.hasOwnProperty(Sheet)) {
              const data = XLSX.utils.sheet_to_row_object_array(
                workbook.Sheets[Sheet]
              );
              resolve(data);
            }
          }
          addToast({ message: 'Upload Success!', type: 'success' });
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsBinaryString(file);
    });
  };

  return (
    <div style={{ display: 'flex' }}>
      <input type='file' className='form-control' accept='.xlsx, .xls' onChange={onImportExcel} />
    </div>
  );
}

UploadXLSX.propTypes = UploadXLSXProps;

export default React.memo(UploadXLSX);
