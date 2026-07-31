# Day 8 — Notes App Frontend + Full CRUD Flow

## One-line idea
This day connected the React frontend to the backend so the app could create, fetch, update, and delete notes from the browser.

## What I learned
- How to build a simple React form for notes
- How to use useState for input values and note list
- How to use useEffect to load data when the page starts
- How to send requests to the backend using axios
- How to refresh the note list after each action

## Main files
- Backend/src/app.js
  - Added better API routes and support for serving the frontend build
- Backend/src/models/note.model.js
  - Keeps the note data structure simple and consistent
- Frontend/src/App.jsx
  - Contains the form, note list, and CRUD button logic

## Important frontend ideas
- Controlled inputs keep the form values in React state
- submitHandler collects form values and sends a POST request
- fetchNote() reloads notes after create, update, or delete actions
- updateNoteId and update mode help switch between create and update behavior

## CRUD flow in simple words
1. User types title and description
2. Frontend sends the data to the backend
3. Backend saves it in MongoDB
4. Frontend fetches the updated list and shows it on the screen

## Quick recall summary
If you want to remember this day quickly, think:
- Day 8 = frontend + full note app flow
- Main idea = connect React UI to backend API and make CRUD work end to end
- Tools used = React, axios, Express, MongoDB
