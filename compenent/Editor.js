import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill CSS'i
import '@/styles/Editor.module.css'; // Import the custom CSS file

const TextEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      value={value || ''} // Default to an empty string
      onChange={onChange}
      modules={TextEditor.modules}
      formats={TextEditor.formats}
      style={{ height: '100%' }}
    />
  );
};

TextEditor.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }], // Text and background color options
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean'] // Clear formatting button
  ],
};

TextEditor.formats = [
  'header', 'bold', 'italic', 'underline',
  'color', 'background', 'list', 'bullet', 'link'
];

export default TextEditor;