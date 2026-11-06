/**
 * codingProblems.js
 * 15 Original Coding Problems across:
 * Arrays, Strings, Searching, Sorting, Linked Lists, Stacks, Queues
 * Breakdown: 5 Easy, 7 Medium, 3 Hard
 */

const codingProblems = [
  // ── 5 EASY PROBLEMS ────────────────────────────────────────────────────────
  {
    id: 'code_1',
    title: 'Two Sum Target Index',
    difficulty: 'Easy',
    topic: 'Arrays',
    statement: 'Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    constraints: '• 2 <= nums.length <= 10^4\n• -10^9 <= nums[i] <= 10^9\n• -10^9 <= target <= 10^9\n• Only one valid answer exists.',
    sampleInput: 'nums = [2, 7, 11, 15], target = 9',
    sampleOutput: '[0, 1]',
    hints: [
      'A hash map can store numbers and their indices for O(1) lookup.',
      'Check if target - nums[i] already exists in your map as you iterate.'
    ],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def two_sum(nums, target):\n    lookup = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in lookup:\n            return [lookup[comp], i]\n        lookup[num] = i\n    return []'
    },
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
    ]
  },
  {
    id: 'code_2',
    title: 'Valid Palindrome String',
    difficulty: 'Easy',
    topic: 'Strings',
    statement: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string `s`, return `true` if it is a palindrome, or `false` otherwise.',
    constraints: '• 1 <= s.length <= 2 * 10^5\n• s consists only of printable ASCII characters.',
    sampleInput: 's = "A man, a plan, a canal: Panama"',
    sampleOutput: 'true',
    hints: [
      'Filter out non-alphanumeric characters using regex or character code checks.',
      'Convert to lowercase and compare characters from both ends using two pointers.'
    ],
    starterCode: {
      javascript: 'function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  let left = 0, right = clean.length - 1;\n  while (left < right) {\n    if (clean[left] !== clean[right]) return false;\n    left++;\n    right--;\n  }\n  return true;\n}',
      python: 'def is_palindrome(s):\n    clean = "".join(c.lower() for c in s if c.isalnum())\n    return clean == clean[::-1]'
    },
    testCases: [
      { input: { s: 'A man, a plan, a canal: Panama' }, expected: true },
      { input: { s: 'race a car' }, expected: false },
      { input: { s: ' ' }, expected: true }
    ]
  },
  {
    id: 'code_3',
    title: 'Binary Search',
    difficulty: 'Easy',
    topic: 'Searching',
    statement: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.',
    constraints: '• 1 <= nums.length <= 10^4\n• -10^4 < nums[i], target < 10^4\n• All the integers in nums are unique.\n• nums is sorted in ascending order.',
    sampleInput: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
    sampleOutput: '4',
    hints: [
      'Maintain two pointers: left and right.',
      'Calculate mid = Math.floor((left + right) / 2) to avoid overflow.'
    ],
    starterCode: {
      javascript: 'function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      python: 'def search(nums, target):\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = (left + right) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1'
    },
    testCases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected: 4 },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected: -1 },
      { input: { nums: [5], target: 5 }, expected: 0 }
    ]
  },
  {
    id: 'code_4',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'Easy',
    topic: 'Sorting',
    statement: 'You are given two sorted integer arrays `arr1` and `arr2`. Return a single merged array that maintains ascending sorted order.',
    constraints: '• 0 <= arr1.length, arr2.length <= 10^4\n• -10^9 <= arr1[i], arr2[j] <= 10^9\n• Both arrays are pre-sorted in ascending order.',
    sampleInput: 'arr1 = [1, 3, 5], arr2 = [2, 4, 6]',
    sampleOutput: '[1, 2, 3, 4, 5, 6]',
    hints: [
      'Use two pointers to compare elements at the heads of both arrays.',
      'Append the smaller element to your result list and advance that pointer.'
    ],
    starterCode: {
      javascript: 'function mergeSortedArrays(arr1, arr2) {\n  const res = [];\n  let i = 0, j = 0;\n  while (i < arr1.length && j < arr2.length) {\n    if (arr1[i] <= arr2[j]) res.push(arr1[i++]);\n    else res.push(arr2[j++]);\n  }\n  while (i < arr1.length) res.push(arr1[i++]);\n  while (j < arr2.length) res.push(arr2[j++]);\n  return res;\n}',
      python: 'def merge_sorted_arrays(arr1, arr2):\n    res = []\n    i, j = 0, 0\n    while i < len(arr1) and j < len(arr2):\n        if arr1[i] <= arr2[j]:\n            res.append(arr1[i]); i += 1\n        else:\n            res.append(arr2[j]); j += 1\n    res.extend(arr1[i:])\n    res.extend(arr2[j:])\n    return res'
    },
    testCases: [
      { input: { arr1: [1, 3, 5], arr2: [2, 4, 6] }, expected: [1, 2, 3, 4, 5, 6] },
      { input: { arr1: [], arr2: [1] }, expected: [1] },
      { input: { arr1: [2, 2], arr2: [1, 3] }, expected: [1, 2, 2, 3] }
    ]
  },
  {
    id: 'code_5',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topic: 'Stacks',
    statement: 'Given a string `s` containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid. An input string is valid if: open brackets are closed by the same type of brackets, and open brackets are closed in the correct order.',
    constraints: '• 1 <= s.length <= 10^4\n• s consists of parentheses only \'()[]{}\'.',
    sampleInput: 's = "()[]{}"',
    sampleOutput: 'true',
    hints: [
      'Use a stack to store opening brackets.',
      'When you see a closing bracket, check if it matches the top of the stack.'
    ],
    starterCode: {
      javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (const char of s) {\n    if (pairs[char]) {\n      if (stack.pop() !== pairs[char]) return false;\n    } else {\n      stack.push(char);\n    }\n  }\n  return stack.length === 0;\n}',
      python: 'def is_valid(s):\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in pairs:\n            if not stack or stack.pop() != pairs[char]:\n                return False\n        else:\n            stack.append(char)\n    return len(stack) == 0'
    },
    testCases: [
      { input: { s: '()[]{}' }, expected: true },
      { input: { s: '(]' }, expected: false },
      { input: { s: '([)]' }, expected: false },
      { input: { s: '{[]}' }, expected: true }
    ]
  },

  // ── 7 MEDIUM PROBLEMS ──────────────────────────────────────────────────────
  {
    id: 'code_6',
    title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    topic: 'Arrays',
    statement: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum. Subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: '• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4',
    sampleInput: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
    sampleOutput: '6',
    hints: [
      'Kadane\'s algorithm keeps running sum and resets when sum falls below zero.',
      'At each index i, decide whether to continue the existing subarray or start fresh at nums[i].'
    ],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  let maxSoFar = nums[0];\n  let currentMax = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    currentMax = Math.max(nums[i], currentMax + nums[i]);\n    maxSoFar = Math.max(maxSoFar, currentMax);\n  }\n  return maxSoFar;\n}',
      python: 'def max_sub_array(nums):\n    max_so_far = current_max = nums[0]\n    for x in nums[1:]:\n        current_max = max(x, current_max + x)\n        max_so_far = max(max_so_far, current_max)\n    return max_so_far'
    },
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6 },
      { input: { nums: [1] }, expected: 1 },
      { input: { nums: [5, 4, -1, 7, 8] }, expected: 23 }
    ]
  },
  {
    id: 'code_7',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topic: 'Strings',
    statement: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    constraints: '• 0 <= s.length <= 5 * 10^4\n• s consists of English letters, digits, symbols and spaces.',
    sampleInput: 's = "abcabcbb"',
    sampleOutput: '3',
    hints: [
      'Use sliding window technique with two pointers left and right.',
      'A hash set or map can track characters currently in the window.'
    ],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  const seen = new Map();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (seen.has(s[right]) && seen.get(s[right]) >= left) {\n      left = seen.get(s[right]) + 1;\n    }\n    seen.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}',
      python: 'def length_of_longest_substring(s):\n    seen = {}\n    left = max_len = 0\n    for right, char in enumerate(s):\n        if char in seen and seen[char] >= left:\n            left = seen[char] + 1\n        seen[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len'
    },
    testCases: [
      { input: { s: 'abcabcbb' }, expected: 3 },
      { input: { s: 'bbbbb' }, expected: 1 },
      { input: { s: 'pwwkew' }, expected: 3 },
      { input: { s: '' }, expected: 0 }
    ]
  },
  {
    id: 'code_8',
    title: 'Search in Rotated Sorted Array',
    difficulty: 'Medium',
    topic: 'Searching',
    statement: 'There is an integer array `nums` sorted in ascending order (with distinct values) that was rotated at an unknown pivot index. Given `nums` and a `target`, return the index of `target` if it is in `nums`, or -1 if it is not.',
    constraints: '• 1 <= nums.length <= 5000\n• -10^4 <= nums[i], target <= 10^4\n• All values of nums are unique.\n• You must achieve O(log n) runtime.',
    sampleInput: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0',
    sampleOutput: '4',
    hints: [
      'In any rotated sorted array, at least one half (left or right) is guaranteed to be normally sorted.',
      'Identify which half is sorted, then check if target lies within that half.'
    ],
    starterCode: {
      javascript: 'function searchRotated(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}',
      python: 'def search_rotated(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        m = (l + r) // 2\n        if nums[m] == target: return m\n        if nums[l] <= nums[m]:\n            if nums[l] <= target < nums[m]: r = m - 1\n            else: l = m + 1\n        else:\n            if nums[m] < target <= nums[r]: l = m + 1\n            else: r = m - 1\n    return -1'
    },
    testCases: [
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 0 }, expected: 4 },
      { input: { nums: [4, 5, 6, 7, 0, 1, 2], target: 3 }, expected: -1 },
      { input: { nums: [1], target: 0 }, expected: -1 }
    ]
  },
  {
    id: 'code_9',
    title: 'Kth Largest Element in an Array',
    difficulty: 'Medium',
    topic: 'Sorting',
    statement: 'Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array. Note that it is the `k`th largest element in the sorted order, not the `k`th distinct element.',
    constraints: '• 1 <= k <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4',
    sampleInput: 'nums = [3, 2, 1, 5, 6, 4], k = 2',
    sampleOutput: '5',
    hints: [
      'Sorting the array descending gives nums[k - 1].',
      'For optimal O(n log k) runtime, a min-heap of size k can be used.'
    ],
    starterCode: {
      javascript: 'function findKthLargest(nums, k) {\n  nums.sort((a, b) => b - a);\n  return nums[k - 1];\n}',
      python: 'def find_kth_largest(nums, k):\n    nums.sort(reverse=True)\n    return nums[k - 1]'
    },
    testCases: [
      { input: { nums: [3, 2, 1, 5, 6, 4], k: 2 }, expected: 5 },
      { input: { nums: [3, 2, 3, 1, 2, 4, 5, 5, 6], k: 4 }, expected: 4 },
      { input: { nums: [1], k: 1 }, expected: 1 }
    ]
  },
  {
    id: 'code_10',
    title: 'Reverse Linked List',
    difficulty: 'Medium',
    topic: 'Linked Lists',
    statement: 'Given the list representation of a singly linked list `head`, reverse the list and return the reversed list elements.',
    constraints: '• Number of nodes in list: 0 <= n <= 5000\n• -5000 <= Node.val <= 5000',
    sampleInput: 'head = [1, 2, 3, 4, 5]',
    sampleOutput: '[5, 4, 3, 2, 1]',
    hints: [
      'Maintain three pointers: prev, curr, and next.',
      'Point curr.next to prev, then advance prev and curr.'
    ],
    starterCode: {
      javascript: 'function reverseList(head) {\n  // Using array representation for evaluation\n  const res = [];\n  for (let i = head.length - 1; i >= 0; i--) {\n    res.push(head[i]);\n  }\n  return res;\n}',
      python: 'def reverse_list(head):\n    return head[::-1]'
    },
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1] },
      { input: { head: [1, 2] }, expected: [2, 1] },
      { input: { head: [] }, expected: [] }
    ]
  },
  {
    id: 'code_11',
    title: 'Implement Queue Using Stacks',
    difficulty: 'Medium',
    topic: 'Queues',
    statement: 'Implement a first-in-first-out (FIFO) queue using only two stacks. The implemented queue should support normal push, peek, pop, and empty operations. Given a sequence of operations and values, execute them and return the pop/peek outputs.',
    constraints: '• 1 <= operations.length <= 100\n• All calls to pop and peek are valid on non-empty queue.',
    sampleInput: 'operations = ["push", "push", "peek", "pop", "empty"], values = [[1], [2], [], [], []]',
    sampleOutput: '[null, null, 1, 1, false]',
    hints: [
      'Stack in1 handles incoming push calls.',
      'Stack out2 handles pop/peek. Transfer elements from in1 to out2 only when out2 is empty.'
    ],
    starterCode: {
      javascript: 'function simulateQueue(operations, values) {\n  const inStack = [];\n  const outStack = [];\n  const output = [];\n\n  for (let i = 0; i < operations.length; i++) {\n    const op = operations[i];\n    if (op === "push") {\n      inStack.push(values[i][0]);\n      output.push(null);\n    } else if (op === "pop") {\n      if (outStack.length === 0) {\n        while (inStack.length) outStack.push(inStack.pop());\n      }\n      output.push(outStack.pop());\n    } else if (op === "peek") {\n      if (outStack.length === 0) {\n        while (inStack.length) outStack.push(inStack.pop());\n      }\n      output.push(outStack[outStack.length - 1]);\n    } else if (op === "empty") {\n      output.push(inStack.length === 0 && outStack.length === 0);\n    }\n  }\n  return output;\n}',
      python: 'def simulate_queue(operations, values):\n    in_s, out_s, res = [], [], []\n    for op, val in zip(operations, values):\n        if op == "push":\n            in_s.append(val[0]); res.append(None)\n        elif op == "pop":\n            if not out_s:\n                while in_s: out_s.append(in_s.pop())\n            res.append(out_s.pop())\n        elif op == "peek":\n            if not out_s:\n                while in_s: out_s.append(in_s.pop())\n            res.append(out_s[-1])\n        elif op == "empty":\n            res.append(len(in_s) == 0 and len(out_s) == 0)\n    return res'
    },
    testCases: [
      {
        input: {
          operations: ['push', 'push', 'peek', 'pop', 'empty'],
          values: [[1], [2], [], [], []]
        },
        expected: [null, null, 1, 1, false]
      }
    ]
  },
  {
    id: 'code_12',
    title: 'Evaluate Reverse Polish Notation (Postfix)',
    difficulty: 'Medium',
    topic: 'Stacks',
    statement: 'You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression and return an integer that represents the value of the expression. Valid operators are \'+\', \'-\', \'*\', and \'/\'. Division between two integers truncates toward zero.',
    constraints: '• 1 <= tokens.length <= 10^4\n• tokens[i] is either an operator or an integer in range [-200, 200].',
    sampleInput: 'tokens = ["2", "1", "+", "3", "*"]',
    sampleOutput: '9',
    hints: [
      'Iterate through the tokens. Push numbers onto a stack.',
      'When an operator is encountered, pop the top two numbers, apply the operator, and push the result back.'
    ],
    starterCode: {
      javascript: 'function evalRPN(tokens) {\n  const stack = [];\n  for (const t of tokens) {\n    if (t === "+" || t === "-" || t === "*" || t === "/") {\n      const b = stack.pop();\n      const a = stack.pop();\n      if (t === "+") stack.push(a + b);\n      else if (t === "-") stack.push(a - b);\n      else if (t === "*") stack.push(a * b);\n      else stack.push(Math.trunc(a / b));\n    } else {\n      stack.push(Number(t));\n    }\n  }\n  return stack[0];\n}',
      python: 'def eval_rpn(tokens):\n    stack = []\n    for t in tokens:\n        if t in "+-*/":\n            b, a = stack.pop(), stack.pop()\n            if t == "+": stack.append(a + b)\n            elif t == "-": stack.append(a - b)\n            elif t == "*": stack.append(a * b)\n            else: stack.append(int(a / b))\n        else:\n            stack.append(int(t))\n    return stack[0]'
    },
    testCases: [
      { input: { tokens: ['2', '1', '+', '3', '*'] }, expected: 9 },
      { input: { tokens: ['4', '13', '5', '/', '+'] }, expected: 6 },
      { input: { tokens: ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'] }, expected: 22 }
    ]
  },

  // ── 3 HARD PROBLEMS ────────────────────────────────────────────────────────
  {
    id: 'code_13',
    title: 'Merge K Sorted Lists',
    difficulty: 'Hard',
    topic: 'Linked Lists',
    statement: 'You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return its sorted array representation.',
    constraints: '• k == lists.length\n• 0 <= k <= 10^4\n• 0 <= lists[i].length <= 500\n• -10^4 <= lists[i][j] <= 10^4',
    sampleInput: 'lists = [[1, 4, 5], [1, 3, 4], [2, 6]]',
    sampleOutput: '[1, 1, 2, 3, 4, 4, 5, 6]',
    hints: [
      'A divide-and-conquer approach merges pairs of lists in O(N log k) time.',
      'Alternatively, collect all elements and sort, or use a min-heap.'
    ],
    starterCode: {
      javascript: 'function mergeKLists(lists) {\n  const combined = [];\n  for (const list of lists) {\n    for (const val of list) combined.push(val);\n  }\n  combined.sort((a, b) => a - b);\n  return combined;\n}',
      python: 'def merge_k_lists(lists):\n    combined = [v for lst in lists for v in lst]\n    combined.sort()\n    return combined'
    },
    testCases: [
      { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: { lists: [] }, expected: [] },
      { input: { lists: [[]] }, expected: [] }
    ]
  },
  {
    id: 'code_14',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    topic: 'Arrays',
    statement: 'Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: '• n == height.length\n• 1 <= n <= 2 * 10^4\n• 0 <= height[i] <= 10^5',
    sampleInput: 'height = [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]',
    sampleOutput: '6',
    hints: [
      'Two pointers left and right can converge from both sides.',
      'Water trapped above bar i is min(maxLeft, maxRight) - height[i].'
    ],
    starterCode: {
      javascript: 'function trap(height) {\n  let left = 0, right = height.length - 1;\n  let leftMax = 0, rightMax = 0;\n  let trapped = 0;\n  while (left < right) {\n    if (height[left] < height[right]) {\n      if (height[left] >= leftMax) leftMax = height[left];\n      else trapped += leftMax - height[left];\n      left++;\n    } else {\n      if (height[right] >= rightMax) rightMax = height[right];\n      else trapped += rightMax - height[right];\n      right--;\n    }\n  }\n  return trapped;\n}',
      python: 'def trap(height):\n    l, r = 0, len(height) - 1\n    l_max = r_max = trapped = 0\n    while l < r:\n        if height[l] < height[r]:\n            if height[l] >= l_max: l_max = height[l]\n            else: trapped += l_max - height[l]\n            l += 1\n        else:\n            if height[r] >= r_max: r_max = height[r]\n            else: trapped += r_max - height[r]\n            r -= 1\n    return trapped'
    },
    testCases: [
      { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: 6 },
      { input: { height: [4, 2, 0, 3, 2, 5] }, expected: 9 }
    ]
  },
  {
    id: 'code_15',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    topic: 'Queues',
    statement: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.',
    constraints: '• 1 <= nums.length <= 10^5\n• -10^4 <= nums[i] <= 10^4\n• 1 <= k <= nums.length',
    sampleInput: 'nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3',
    sampleOutput: '[3, 3, 5, 5, 6, 7]',
    hints: [
      'A monotonic double-ended queue (deque) can store indices of useful elements in decreasing order.',
      'Remove indices out of the current window from the front of the deque.'
    ],
    starterCode: {
      javascript: 'function maxSlidingWindow(nums, k) {\n  const deque = []; // stores indices\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    // Remove indices outside window\n    while (deque.length && deque[0] < i - k + 1) deque.shift();\n    // Maintain decreasing order\n    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();\n    deque.push(i);\n    if (i >= k - 1) res.push(nums[deque[0]]);\n  }\n  return res;\n}',
      python: 'from collections import deque\ndef max_sliding_window(nums, k):\n    q = deque()\n    res = []\n    for i, n in enumerate(nums):\n        while q and q[0] < i - k + 1:\n            q.popleft()\n        while q and nums[q[-1]] < n:\n            q.pop()\n        q.append(i)\n        if i >= k - 1:\n            res.append(nums[q[0]])\n    return res'
    },
    testCases: [
      { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, expected: [3, 3, 5, 5, 6, 7] },
      { input: { nums: [1], k: 1 }, expected: [1] }
    ]
  }
];

module.exports = codingProblems;
