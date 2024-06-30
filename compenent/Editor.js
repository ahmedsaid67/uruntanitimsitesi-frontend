import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill CSS'i

const TextEditor = ({ value, onChange }) => {
  return (
    <ReactQuill
      value={value || ''} // Varsayılan olarak boş string
      onChange={onChange}
      modules={TextEditor.modules}
      formats={TextEditor.formats}
    />
  );
};

TextEditor.modules = {
  toolbar: [
    [{ 'header': '1' }, { 'header': '2' }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }, { 'background': [] }], // Metin ve arka plan rengi seçenekleri
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['link'],
    ['clean'] // Temizle butonu
  ],
};

TextEditor.formats = [
  'header', 'bold', 'italic', 'underline',
  'color', 'background', 'list', 'bullet', 'link'
];

export default TextEditor;
