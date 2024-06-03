// App.jsx / App.tsx
"use client"
import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], 
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }], 
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], 
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }], 
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }], 
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
    ]
  };

const TextEditor =()=>{
     const [value, setValue] = useState('');

    return <ReactQuill theme="snow" value={value} onChange={setValue} modules={modules}/>;
}


export default TextEditor;