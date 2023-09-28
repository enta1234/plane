"use client"
import * as React from 'react';
import { useImperativeHandle, useRef, forwardRef } from "react";
import { useEditor, EditorContent, Editor } from "@tiptap/react";
import { useDebouncedCallback } from "use-debounce";
import { TableMenu } from '@/ui/menus/table-menu';
import { TiptapExtensions } from '@/ui/extensions';
import { EditorBubbleMenu } from '@/ui/menus/bubble-menu';
import { ImageResizer } from '@/ui/extensions/image/image-resize';
import { TiptapEditorProps } from '@/ui/props';
import { UploadImage } from '@/types/upload-image';
import { DeleteImage } from '@/types/delete-image';
import { cn } from '@/lib/utils';
import { FixedMenu } from './menus/fixed-menu';

interface ITiptapEditor {
  value: string;
  uploadFile: UploadImage;
  deleteFile: DeleteImage;
  noBorder?: boolean;
  borderOnFocus?: boolean;
  customClassName?: string;
  editorContentCustomClassNames?: string;
  onChange?: (json: any, html: string) => void;
  setIsSubmitting?: (isSubmitting: "submitting" | "submitted" | "saved") => void;
  setShouldShowAlert?: (showAlert: boolean) => void;
  editable?: boolean;
  forwardedRef?: any;
  debouncedUpdatesEnabled?: boolean;
  accessValue: string;
  onAccessChange: (accessKey: string) => void;
  commentAccess: {
    icon: string;
    key: string;
    label: "Private" | "Public";
  }[];
}

interface TiptapProps extends ITiptapEditor {
  forwardedRef?: React.Ref<EditorHandle>;
}

interface EditorHandle {
  clearEditor: () => void;
  setEditorValue: (content: string) => void;
}

const DEBOUNCE_DELAY = 1500;

const TiptapEditor = ({
  onChange,
  debouncedUpdatesEnabled,
  editable,
  setIsSubmitting,
  setShouldShowAlert,
  editorContentCustomClassNames,
  value,
  uploadFile,
  deleteFile,
  noBorder,
  borderOnFocus,
  customClassName,
  forwardedRef,
  accessValue,
  onAccessChange,
  commentAccess,
}: TiptapProps) => {
  const editor = useEditor({
    editable: editable ?? true,
    editorProps: TiptapEditorProps(uploadFile, setIsSubmitting),
    // @ts-expect-err
    extensions: TiptapExtensions(uploadFile, deleteFile, setIsSubmitting),
    content: (typeof value === "string" && value.trim() !== "") ? value : "<p></p>",
    onUpdate: async ({ editor }) => {
      // for instant feedback loop
      setIsSubmitting?.("submitting");
      setShouldShowAlert?.(true);
      if (debouncedUpdatesEnabled) {
        debouncedUpdates({ onChange, editor });
      } else {
        onChange?.(editor.getJSON(), editor.getHTML());
      }
    },
  });

  const editorRef: React.MutableRefObject<Editor | null> = useRef(null);
  editorRef.current = editor;

  useImperativeHandle(forwardedRef, () => ({
    clearEditor: () => {
      editorRef.current?.commands.clearContent();
    },
    setEditorValue: (content: string) => {
      editorRef.current?.commands.setContent(content);
    },
  }));

  const debouncedUpdates = useDebouncedCallback(async ({ onChange, editor }) => {
    if (onChange) {
      onChange(editor.getJSON(), editor.getHTML());
    }
  }, DEBOUNCE_DELAY);

  const editorClassNames = cn(
    'relative w-full max-w-full sm:rounded-lg mt-2 p-3 relative focus:outline-none rounded-md',
    noBorder ? '' : 'border border-custom-border-200',
    borderOnFocus ? 'focus:border border-custom-border-300' : 'focus:border-0',
    customClassName
  );

  if (!editor) return null;

  return (
    <div
      id="tiptap-container"
      onClick={() => {
        editor?.chain().focus().run();
      }}
      className={`tiptap-editor-container cursor-text ${editorClassNames}`}
    >
      <div className="flex flex-col">
        <div className={`${editorContentCustomClassNames}`}>
          <EditorContent editor={editor} />
          <TableMenu editor={editor} />
          {editor?.isActive("image") && <ImageResizer editor={editor} />}
        </div>
        {editor && editable !== false &&
          (<div className="w-full mt-4">
            <FixedMenu editor={editor} commentAccess={commentAccess} accessValue={accessValue} onAccessChange={onAccessChange} />
          </div>)
        }
      </div>
    </div>
  );
};

const TiptapEditorWithRef = forwardRef<EditorHandle, ITiptapEditor>((props, ref) => (
  <TiptapEditor {...props} forwardedRef={ref} />
));

TiptapEditorWithRef.displayName = "TiptapEditorWithRef";

export { TiptapEditor, TiptapEditorWithRef };