const trimTrailing = (value = "") => String(value).trim();

const stripJavaClassWrapper = (code) => {
  const clean = trimTrailing(code);

  // Remove outer class wrapper:
  // public class Main { ... }
  // class Main { ... }
  const publicMatch = clean.match(/^public\s+class\s+Main\s*\{([\s\S]*)\}$/);
  if (publicMatch) {
    return publicMatch[1].trim();
  }

  const plainMatch = clean.match(/^class\s+Main\s*\{([\s\S]*)\}$/);
  if (plainMatch) {
    return plainMatch[1].trim();
  }

  return clean;
};

const trim = (v = "") => String(v).trim();

export const buildExecutableCode = ({ language, userCode, driverCode }) => {
  const code = trim(userCode);
  const driver = trim(driverCode?.[language]);

  if (!code) throw new Error("User code missing");
  if (!driver) throw new Error(`Driver missing for ${language}`);

  // 🚨 IMPORTANT: never mix languages
  switch (language) {
    case "java":
      return `
import java.util.*;
${code}

class Driver {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StringBuilder input = new StringBuilder();

        while (sc.hasNextLine()) {
            input.append(sc.nextLine()).append("\\n");
        }

        System.out.print(Main.solve(input.toString()));
    }
}
`;

    case "cpp":
      return `
#include <bits/stdc++.h>
using namespace std;

${code}

int main() {
    string input, line;
    while (getline(cin, line)) input += line + "\\n";
    cout << solve(input);
}
`;

    case "c":
      return `
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

${code}

int main() {
    char input[10000];
    int len = fread(input, 1, sizeof(input)-1, stdin);
    input[len] = '\\0';
    printf("%s", solve(input));
}
`;

    case "javascript":
      return `
${code}

const fs = require("fs");
const input = fs.readFileSync(0, "utf-8").trim();
process.stdout.write(String(solve(input)));
`;

    case "python":
      return `
${code}

import sys
input_data = sys.stdin.read().strip()
print(solve(input_data))
`;

    default:
      throw new Error("Unsupported language");
  }
};