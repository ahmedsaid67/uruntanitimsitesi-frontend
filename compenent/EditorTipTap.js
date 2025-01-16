import React, { useState } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import Color from '@tiptap/extension-color';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBold, faItalic, faUnderline, faStrikethrough, faHeading, faParagraph, faListUl, faListOl, faUndo, faRedo, faAlignLeft, faAlignCenter, faAlignRight, faAlignJustify } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/EditorTiptap.module.css';
import Placeholder from "@tiptap/extension-placeholder";
import '@fortawesome/fontawesome-svg-core/styles.css';

export const TextEditorTipTap = ({ selectedItem, setSelectedItem }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      Highlight,
      Color,
      Placeholder.configure({
        placeholder: "Bir şeyler yazın…",
      }),
    ],
    editorProps: {
      attributes: {
        class: styles.myCustomEditor,
      },
    },
    content: selectedItem.aciklama || '',
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      setSelectedItem({ ...selectedItem, aciklama: content });
    },
    immediatelyRender: false,
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <div className={styles.editorContainer}>
        <div className={styles.editorToolbar}>
          <button onClick={() => editor.chain().focus().toggleBold().run()}>
            <FontAwesomeIcon icon={faBold} />
          </button>
          <button onClick={() => editor.chain().focus().toggleItalic().run()}>
            <FontAwesomeIcon icon={faItalic} />
          </button>
          <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <FontAwesomeIcon icon={faUnderline} />
          </button>
          <button onClick={() => editor.chain().focus().toggleStrike().run()}>
            <FontAwesomeIcon icon={faStrikethrough} />
          </button>
          <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>
            <FontAwesomeIcon icon={faHeading} /> 1
          </button>
          <button onClick={() => editor.chain().focus().setParagraph().run()}>
            <FontAwesomeIcon icon={faParagraph} />
          </button>
          <button onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <FontAwesomeIcon icon={faListUl} />
          </button>
          <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <FontAwesomeIcon icon={faListOl} />
          </button>
          <button onClick={() => editor.chain().focus().undo().run()}>
            <FontAwesomeIcon icon={faUndo} />
          </button>
          <button onClick={() => editor.chain().focus().redo().run()}>
            <FontAwesomeIcon icon={faRedo} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('left').run()}>
            <FontAwesomeIcon icon={faAlignLeft} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>
            <FontAwesomeIcon icon={faAlignCenter} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('right').run()}>
            <FontAwesomeIcon icon={faAlignRight} />
          </button>
          <button onClick={() => editor.chain().focus().setTextAlign('justify').run()}>
            <FontAwesomeIcon icon={faAlignJustify} />
          </button>
        </div>

        {editor && (
          <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
            <button onClick={() => editor.chain().focus().toggleBold().run()}>
              <FontAwesomeIcon icon={faBold} />
            </button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()}>
              <FontAwesomeIcon icon={faItalic} />
            </button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()}>
              <FontAwesomeIcon icon={faUnderline} />
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()}>
              <FontAwesomeIcon icon={faStrikethrough} />
            </button>
          </BubbleMenu>
        )}

        <div style={{ height: '100%', width: '100%' }}>
          <EditorContent editor={editor} className={styles.editorContent} />
        </div>
      </div>
    </>
  );
};
