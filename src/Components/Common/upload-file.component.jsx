import React, { useState } from "react";
import PropTypes  from 'prop-types'

const UploadContractProps =  {
  setContract: PropTypes.func.isRequired,
}


function UploadContract({setContract}) {
  const handleFiles = (event) => {
    const contracts = event.target.files;
    setContract(contracts[0])
  };

  return (
    <>
      <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
      <input type="file" className='form-control' id="upload" onChange={handleFiles} />
    </>
  );
}

UploadContract.propTypes = UploadContractProps

export default React.memo(UploadContract)
