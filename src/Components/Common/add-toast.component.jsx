import React from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function addToast({ message, position = 'top-center', type }) {
  return toast(message, { position, type, theme: 'colored', autoClose: 3000 });
}
