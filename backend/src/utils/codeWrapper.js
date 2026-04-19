const trim = (value = "") => String(value ?? "").trim();

const ensureUserCode = (userCode) => {
  const cleanUserCode = trim(userCode);

  if (!cleanUserCode) {
    const error = new Error("User code is required");
    error.statusCode = 400;
    throw error;
  }

  return cleanUserCode;
};

const ensureDriverCode = ({ language, driverCode }) => {
  const cleanDriverCode = trim(driverCode);

  if (!cleanDriverCode) {
    const error = new Error(`Driver code is missing for language: ${language}`);
    error.statusCode = 500;
    throw error;
  }

  return cleanDriverCode;
};

const mergeWithoutDuplicateIncludes = (baseIncludes, userCode) => {
  const lines = trim(userCode).split("\n");

  const filtered = lines.filter((line) => {
    const clean = line.trim();
    return !baseIncludes.some((inc) => clean === inc);
  });

  return filtered.join("\n").trim();
};

export const buildExecutableCode = ({ language, userCode, driverCode }) => {
  const cleanUserCode = ensureUserCode(userCode);

  switch (language) {
    case "javascript": {
      const cleanDriverCode = ensureDriverCode({ language, driverCode });

      return `${cleanUserCode}

${cleanDriverCode}
`;
    }

    case "python": {
      const cleanDriverCode = ensureDriverCode({ language, driverCode });

      return `${cleanUserCode}

${cleanDriverCode}
`;
    }

    case "cpp": {
      const cleanDriverCode = ensureDriverCode({ language, driverCode });

      const mergedUserCode = mergeWithoutDuplicateIncludes(
        ["#include <bits/stdc++.h>", "using namespace std;"],
        cleanUserCode
      );

      return `#include <bits/stdc++.h>
using namespace std;

${mergedUserCode}

${cleanDriverCode}
`;
    }

    case "c": {
      const cleanDriverCode = ensureDriverCode({ language, driverCode });

      const mergedUserCode = mergeWithoutDuplicateIncludes(
        ["#include <stdio.h>", "#include <stdlib.h>", "#include <string.h>"],
        cleanUserCode
      );

      return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

${mergedUserCode}

${cleanDriverCode}
`;
    }

    case "java": {
      const mergedUserCode = mergeWithoutDuplicateIncludes(
        ["import java.util.*;"],
        cleanUserCode
      );

      return `import java.util.*;

${mergedUserCode}

class Driver {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        StringBuilder input = new StringBuilder();

        while (sc.hasNextLine()) {
            input.append(sc.nextLine());
            if (sc.hasNextLine()) {
                input.append("\\n");
            }
        }

        System.out.print(Main.solve(input.toString()));
        sc.close();
    }
}
`;
    }

    default: {
      const error = new Error("Unsupported language");
      error.statusCode = 400;
      throw error;
    }
  }
};