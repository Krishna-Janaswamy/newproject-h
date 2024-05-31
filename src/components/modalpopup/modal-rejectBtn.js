import { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@mui/material';

const RejectEnquiryModal = ({ isOpen, onClose, onReject }) => {
  const [remarks, setRemarks] = useState('');

  const handleRemarksChange = (e) => {
    setRemarks(e.target.value);
  };

  const handleReject = () => {
    onReject(remarks);
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 2,
        }}
      >
        <Typography variant="h6" component="h2" gutterBottom>
          Reject Enquiry
        </Typography>
        <TextField
          id="remarks"
          label="Remarks"
          value={remarks}
          onChange={handleRemarksChange}
          multiline
          fullWidth
          required
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleReject} sx={{ ml: 1 }}>
            Reject
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RejectEnquiryModal;