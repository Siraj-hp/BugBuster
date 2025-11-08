export interface Challenge {
  id: number
  title: string
  language: "python"
  description: string
  buggyCode: string
  errors: {
    id: number
    description: string
    solution: string[]
  }[]
  expectedOutput: string
}

// Updated challenges with the new questions
export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Fix the List Sum Function",
    language: "python",
    description:
      "This function should calculate the sum of all numbers in a list, but it has 5 bugs. Fix the code to correctly sum all elements in the list.",
    buggyCode: `def list_sum(numbers)
    total = 0
    fori in numbers:
        total = total + numbers[i]
    printf("Sum: " + total)

list_sum([10, 20, 30, 40, 50])`,
    errors: [
      {
        id: 1,
        description: "SyntaxError: expected ':'",
        solution: ["def list_sum(numbers):"],
      },
      {
        id: 2,
        description: "IndexError: list index out of range",
        solution: ["total = total + i"],
      },
      {
        id: 3,
        description: "TypeError: can only concatenate str (not 'int') to str",
        solution: ['print("Sum: " + str(total))'],
      },
      {
        id: 4,
        description: "NameError: name 'printf' is not defined.",
        solution: ['print("Sum: " + str(total))'],
      },
      {
        id: 5,
        description: "fori in numbers:",
        solution: ["for i in numbers:"],
      },
    ],
    expectedOutput: "Sum: 150",
  },
  {
    id: 2,
    title: "Write a Python program to reverse a string",
    language: "python",
    description:
      "This function should reverse a string, but it has 5 bugs. Fix the code to correctly reverse the input string.",
    buggyCode: `def reverse_string(s)
    reversed = ""
    for i in range(len(s - 1, -1, -1)
        reversed =+ s[i]
    return == reversed
a = input("Enter a string: ")
print(reverse_string(aa))`,
    errors: [
      {
        id: 1,
        description: "SyntaxError: expected ':'",
        solution: ["def reverse_string(s):"],
      },
      {
        id: 2,
        description: "SyntaxError: '(' was never closed",
        solution: ["for i in range(len(s) - 1, -1, -1):"],
      },
      {
        id: 3,
        description: "TypeError: bad operand type for unary +: 'str'",
        solution: ["reversed += s[i]"],
      },
      {
        id: 4,
        description: "incorrect variable in print statement",
        solution: ["print(reverse_string(a))"],
      },
      {
        id: 5,
        description: "SyntaxError: invalid syntax",
        solution: ["return reversed"],
      },
    ],
    expectedOutput: "Enter a string: hello\nolleh",
  },
  {
    id: 3,
    title: "Write a Python program to count vowels in a string",
    language: "python",
    description:
      "This function should count the number of vowels in a string, but it has 5 bugs. Fix the code to correctly count vowels.",
    buggyCode: `def count_vowels(s):
    vowels = 'aeiouAEIOU
    count = 1
    for char s:
        if char in vowels:
            count =+ 1
    return count
text = input("Enter text: ")
print("Vowel count:" + count_vowels(text))`,
    errors: [
      {
        id: 1,
        description: "TypeError: bad operand type for unary +: 'str'",
        solution: ["count += 1"],
      },
      {
        id: 2,
        description: "SyntaxError: unterminated string literal (detected at line 2)",
        solution: ["vowels = 'aeiouAEIOU'", 'vowels = "aeiouAEIOU"'],
      },
      {
        id: 3,
        description: "SyntaxError: invalid syntax in for loop(char s):",
        solution: ["for char in s:"],
      },
      {
        id: 4,
        description: "TypeError: can only concatenate str (not 'int') to str",
        solution: [
          'print("Vowel count:", count_vowels(text))',
          'print("Vowel count:",count_vowels(text))',
          'print("Vowel count:" , count_vowels(text))',
          'print("Vowel count:" ,count_vowels(text))',
        ],
      },
      {
        id: 5,
        description: "incorrect value for count = 1",
        solution: ["count = 0"],
      },
    ],
    expectedOutput: "Enter text: hello\nVowel count: 2",
  },
  {
    id: 4,
    title: "Write a Python program to calculate the square of numbers from 1 to 5",
    language: "python",
    description:
      "This function should print the squares of numbers from 1 to 5, but it has 5 bugs. Fix the code to correctly display the squares.",
    buggyCode: `def print_squares()
    for i in range[1, 6]
        print(f"Square of{i}is{i*i}")
print_squares()`,
    errors: [
      {
        id: 1,
        description: "SyntaxError: expected ':'",
        solution: ["def print_squares():"],
      },
      {
        id: 2,
        description: "TypeError: type 'range' is not subscriptable",
        solution: ["for i in range(1, 6):"],
      },
      {
        id: 3,
        description: "Missing spaces in f-string output(mismatch with the expected output)",
        solution: ['print(f"Square of {i} is {i*i}")'],
      },
      {
        id: 4,
        description: "",
        solution: ["print_squares()"],
      },
      {
        id: 5,
        description: "",
        solution: ["print_squares()"],
      },
    ],
    expectedOutput: "Square of 1 is 1\nSquare of 2 is 4\nSquare of 3 is 9\nSquare of 4 is 16\nSquare of 5 is 25",
  },
  {
    id: 5,
    title: "Fix the List Duplicates Remover",
    language: "python",
    description:
      "This function should remove duplicates from a list while preserving the original order, but it has 5 bugs. Fix the code to correctly remove duplicates.",
    buggyCode: `def remove_duplicates(lst)
    seen = list()
    result = []
for item in lst:
        if item not in seen:
            seen(item)
            result.append[item]
    return result
lst1 = [1, 2, 3, 1, 2, 5, 6, 7, 8]
lst2 = ['apple', 'banana', 'apple', 'orange', 'banana', 'grape']
print("Original:", lst1)
print("Without duplicates:", remove_duplicates(lst1))
print("Original:", lst2)
print("Without duplicates:", remove_duplicates(lst2))`,
    errors: [
      {
        id: 1,
        description: "SyntaxError: expected ':'",
        solution: ["def remove_duplicates(lst):"],
      },
      {
        id: 2,
        description: "TypeError: 'list' object is not callable",
        solution: ["seen = set()"],
      },
      {
        id: 3,
        description: "IndentationError: unindent does not match any outer indentation level",
        solution: ["    for item in lst:"],
      },
      {
        id: 4,
        description: "TypeError: 'set' object is not callable",
        solution: ["seen.add(item)"],
      },
      {
        id: 5,
        description: "TypeError: 'builtin_function_or_method' object is not subscriptable",
        solution: ["result.append(item)"],
      },
    ],
    expectedOutput:
      "Original: [1, 2, 3, 1, 2, 5, 6, 7, 8]\nWithout duplicates: [1, 2, 3, 5, 6, 7, 8]\nOriginal: ['apple', 'banana', 'apple', 'orange', 'banana', 'grape']\nWithout duplicates: ['apple', 'banana', 'orange', 'grape']",
  },
]
