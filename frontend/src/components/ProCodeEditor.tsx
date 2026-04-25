import Editor from "@monaco-editor/react";

type SupportedLanguage = "javascript" | "python" | "cpp" | "java" | "c";

type Props = {
  language: SupportedLanguage;
  value: string;
  onChange: (value: string) => void;
};

const languageMap: Record<SupportedLanguage, string> = {
  javascript: "javascript",
  python: "python",
  cpp: "cpp",
  java: "java",
  c: "c",
};

const starterByLanguage: Record<SupportedLanguage, string> = {
  javascript: `function solve(input) {
  // write your solution here
}

module.exports = solve;`,
  python: `def solve(input_data):
    # write your solution here
    pass`,
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    // write your solution here
    return 0;
}`,
  java: `import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {
        // write your solution here
    }
}`,
  c: `#include <stdio.h>

int main() {
    // write your solution here
    return 0;
}`,
};

export default function ProCodeEditor({
  language,
  value,
  onChange,
}: Props) {
  return (
    <div className="h-full w-full overflow-hidden rounded-[1.2rem] border border-border/70 bg-[#0b1020]">
      <Editor
        height="100%"
        width="100%"
        language={languageMap[language]}
        theme="vs-dark"
        value={value || starterByLanguage[language]}
        onChange={(next) => onChange(next ?? "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontLigatures: true,
          roundedSelection: true,
          smoothScrolling: true,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          tabSize: 2,
          cursorBlinking: "smooth",
          renderLineHighlight: "all",
          bracketPairColorization: { enabled: true },
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: false,
            strings: true,
          },
        }}
      />
    </div>
  );
}