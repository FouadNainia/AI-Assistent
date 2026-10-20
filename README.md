# WebTech Assistent — Hochschule Merseburg

A bilingual (DE/EN) AI-powered learning assistant for the Web Technologies module.  
Built with vanilla JavaScript and the OpenAI GPT API.

##  Live Demo
[fouadnainia.github.io/AI-Assistent](https://fouadnainia.github.io/AI-Assistent)

##  Features
- Ask questions about HTML, CSS, JavaScript, HTTP, DOM & Responsive Design
- Bilingual: German 🇩🇪 & English 🇬🇧
- Topic sidebar with quick suggestion buttons
- Code blocks with syntax highlighting
- Conversation history (last 10 messages)
- Hamburger menu on mobile 
- Fully responsive: works on all screen sizes

## Built With
- HTML5 / CSS3 / JavaScript (Vanilla — no frameworks)
- [OpenAI API](https://platform.openai.com/) (GPT-3.5-turbo)
- Mobile-first CSS with Flexbox
- 3 separate files: `index.html`, `style.css`, `app.js`

##  Project Structure
```
AI-Assistent/
├── index.html    # HTML structure
├── style.css     # Mobile-first styles
└── app.js        # Logic, API calls, language toggle
```

##  How to Use
1. Open the live demo or clone the repo
2. Enter your OpenAI API Key in the input field
3. Choose a topic from the sidebar
4. Start asking questions!

>  You need your own OpenAI API Key — get one at [platform.openai.com](https://platform.openai.com)

##  API Key
The key is stored only in your browser (`localStorage`) and never sent anywhere except directly to OpenAI.

```bash
git clone https://github.com/FouadNainia/AI-Assistent
```
