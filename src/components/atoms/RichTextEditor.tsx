// ...existing code...
import React, { useRef, useEffect, useState, useMemo, useCallback, forwardRef } from "react";
import JoditEditor from "jodit-react";

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichTextEditor = forwardRef<any, RichTextEditorProps>(({ value, onChange, placeholder }, ref) => {
  const editorRef = useRef<any>(null);
  const [internalValue, setInternalValue] = useState<string>(value);

  // keep internal state in sync with external prop unless unchanged
  useEffect(() => {
    if (value !== internalValue) {
      setInternalValue(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // expose inner ref to parent if a ref is provided
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      ref(editorRef.current);
    } else {
      (ref as React.MutableRefObject<any>).current = editorRef.current;
    }
  }, [ref]);

  const config = useMemo(
    () => ({
      readonly: false,
      height: 250,
      placeholder: placeholder || "Start typing here...",
      toolbarSticky: false,
      toolbarAdaptive: false,
      showXPathInStatusbar: false,
      buttons: [
        "bold",
        "italic",
        "underline",
        "|",
        "ul",
        "ol",
        "|",
        "link",
        "image",
        "|",
        "align",
        "font",
        "fontsize",
        "|",
        "undo",
        "redo",
      ],
    }),
    [placeholder]
  );

  const handleBlur = useCallback(
    (content: string) => {
      setInternalValue(content);
      onChange(content);
    },
    [onChange]
  );

  return (
    <JoditEditor
      ref={editorRef}
      value={internalValue}
      config={config}
      onBlur={handleBlur}
    />
  );
});

export default RichTextEditor;