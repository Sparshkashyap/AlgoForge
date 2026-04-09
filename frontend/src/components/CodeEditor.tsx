import Editor from "@monaco-editor/react";

type Props = {
  language: string;
  value: string;
  onChange: (value: string) => void;
};

export default function CodeEditor({ language, value, onChange }: Props) {
  return (
    <div className="rounded-xl overflow-hidden border">
      <Editor
        height="420px"
        theme="vs-dark"
        language={language.toLowerCase()}
        value={value}
        onChange={(val) => onChange(val || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          scrollBeyondLastLine: false,
          automaticLayout: true
        }}
      />
    </div>
  );
}