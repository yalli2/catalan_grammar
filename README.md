# Català · Catalan Grammar — interactive study site

Interactive class site based on *Catalan: An Essential Grammar* (Nicolau Dols & Richard Mansell, Routledge 2017).

- **Main page** (`index.html`): all 20 chapters + verb-conjugation appendix, grouped by the book's four parts, with search and personal progress (saved in the browser).
- **Chapter pages** (`chapter.html?c=1` … `c=21`): 📖 Learn (explanations, paradigm tables, examples) · 🗣️ Key expressions · ✏️ Practice (multiple choice, fill-in, true/false, word order, matching — instant check, "Grade all", score, retry wrong answers).
- **Catalan audio**: every Catalan word/sentence has a 🔊 button. The site picks the best native Catalan (ca-ES) voice on the device (Microsoft Edge's neural voices Joana/Enric are the most natural; macOS/iOS: Montserrat/Jordi). If the device has no Catalan voice, an online Catalan voice is used. Speed and voice can be changed in **🔊 Voice settings**.
- **Interface languages** (top-right 🌐): 한국어, English, Español, Català, Français, Deutsch, 中文, 日本語. Explanations are available in Korean, English and Spanish (other interface languages show English explanations).

Content (explanations, examples, exercises) is written for classroom use; the textbook itself contains no exercises.

## Structure
```
index.html, chapter.html
assets/  app.js (i18n, audio, header) · main.js · chapter.js · style.css
data/    index.json · ch01.json … ch21.json
```
