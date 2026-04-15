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

export const buildExecutableCode = ({ language, userCode, driverCode }) => {
  const cleanUserCode = trimTrailing(userCode);
  const cleanDriverCode = trimTrailing(driverCode);

  if (!cleanUserCode) {
    const error = new Error("User code is required");
    error.statusCode = 400;
    throw error;
  }

  switch (language) {
    case "java": {
      // Java ke liye driverCode ignore karo
      // Hum directly Main class me main() inject karenge
      const classBody = stripJavaClassWrapper(cleanUserCode);

      return `import java.util.*;

public class Main {
${classBody ? `\n${classBody}\n` : ""}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StringBuilder input = new StringBuilder();

        while (sc.hasNextLine()) {
            input.append(sc.nextLine()).append("\\n");
        }

        String result = solve(input.toString());
        System.out.print(result);

        sc.close();
    }
}
`;
    }

    case "cpp":
    case "c":
    case "javascript":
    case "python": {
      if (!cleanDriverCode) {
        const error = new Error(`Driver code is missing for language: ${language}`);
        error.statusCode = 500;
        throw error;
      }

      return `${cleanUserCode}

${cleanDriverCode}
`;
    }

    default: {
      const error = new Error("Unsupported language for wrapping");
      error.statusCode = 400;
      throw error;
    }
  }
};