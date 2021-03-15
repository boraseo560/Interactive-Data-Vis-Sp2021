## NOTES

---

INSTRUCTIONS:
Use this markdown file to keep track of open questions/challenges from this week's assignment.

- What did you have trouble solving?
- What went easier than expected?
- What, if anything, is currently blocking you?

Sometimes it helps to formulate what you understood and where you got stuck in order to move forward. Feel free to include `code snippets`, `screenshots`, and `error message text` here as well.

If you find you're not able complete this week's assignment, reflecting on where you are getting stuck here will help you get full credit for this week's tutorial

---
# What, if anything, is currently blocking you?

There is a problem that the circle points disappear after mousemove event, I was not able to find why and how to fix it.

# Simple study notes

1. How to write by Markdown: https://gist.github.com/ihoneymon/652be052a0727ad59601 (Korean)

2. "let" vs "var" vs "const": Different ways of declaring variables

   - var: Used before ES6, function-scoped, can be reassigned, can be redeclared

   - let: Introduced in ES6, block({})-scoped, can be reassigned, cannot be redeclared

   ```
   function fruitName() {
       let fruit = "Apple";
       let fruit = "Peach";
       console.log(fruit)
   }
   fruitName(); // Will give error (cannot be redeclared)
   ```

   However

   ```
   function fruitName() {
       let fruit = "Apple";
       fruit = "Peach";
       console.log(fruit)
   }
   fruitName(); // Will show "Peach" (can be reassigned)
   ```

   - const: Introduced in ES6, block({})-scoped, cannot be reassigned, cannot be redeclared

3. What is Hoisting?:
   - https://developer.mozilla.org/en-US/docs/Glossary/Hoisting
   - https://gmlwjd9405.github.io/2019/04/22/javascript-hoisting.html (Korean)

4. If there is space in a column name: 

    ```
    d => d['Column Name']
    ```
5. Formatting numbers: 
    - http://bl.ocks.org/mstanaland/6106487