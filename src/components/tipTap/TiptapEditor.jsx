import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import ListItem from '@tiptap/extension-list-item';
import Link from '@tiptap/extension-link';

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  Link.configure({ openOnClick: false }),
  StarterKit.configure({
    bulletList: { keepMarks: true, keepAttributes: false },
    orderedList: { keepMarks: true, keepAttributes: false },
  }),
];

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const buttonClass = (active) =>
    `w-8 h-8 flex items-center justify-center text-sm font-semibold border  rounded 
     ${active ? 'bg-ibmblue text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`;

  return (
    <div className="flex flex-wrap gap-2 mb-3">
      <button onClick={() => editor.chain().focus().toggleBold().run()} className={buttonClass(editor.isActive('bold'))} title="Bold">B</button>
      <button onClick={() => editor.chain().focus().toggleItalic().run()} className={buttonClass(editor.isActive('italic'))}   title="Italic">I</button>
      <button onClick={() => editor.chain().focus().toggleStrike().run()} className={buttonClass(editor.isActive('strike'))}><span className="line-through" title="Strikethrough">S</span></button>
      <button onClick={() => editor.chain().focus().toggleCode().run()} className={buttonClass(editor.isActive('code'))}  title="Inline Code">{'</>'}</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={buttonClass(editor.isActive('heading', { level: 2 }))} title="Heading">H2</button>
      <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={buttonClass(editor.isActive('bulletList'))} title="Bullet List">•</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={buttonClass(editor.isActive('orderedList'))}  title="Numbered List">1.</button>
      <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={buttonClass(editor.isActive('blockquote'))} title="Blockquote">“”</button>
      <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={buttonClass(editor.isActive('codeBlock'))} title="Code Block">⌘</button>
      <button onClick={() => {
        const url = window.prompt('Enter a URL');
        if (url) editor.chain().focus().setLink({ href: url }).run();
      }} className={buttonClass(editor.isActive('link'))}  title="Insert Link">🔗</button>
      <button onClick={() => editor.chain().focus().undo().run()} className={buttonClass(false)} title="Undo">↺</button>
      <button onClick={() => editor.chain().focus().redo().run()} className={buttonClass(false)} title="Redo">↻</button>
      <button onClick={() => editor.chain().focus().unsetAllMarks().run()} className={buttonClass(false)} title="Clear formatting">⨉</button>
    </div>
  );
};

const TiptapEditor = ({ content, onChange }) => {
  const editor = useEditor({
    extensions,
    content,
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none p-3 border border-ibmblue rounded bg-white min-h-[150px] focus:outline-none list-disc list-inside',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // This will reset editor content when the `content` prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false); // false disables history tracking for undo/redo
    }
  }, [content, editor]);

  return (
    <>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </>
  );
};

export default TiptapEditor;
