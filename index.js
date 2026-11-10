const fs = require('fs');
const path = require('path');

// Define the path for the JSON storage file
const filePath = path.join(__dirname, 'notes.json');

// Function to read and parse notes from the JSON file
function getNotes() {
    if (!fs.existsSync(filePath)) {
        return [];
    }
    const dataBuffer = fs.readFileSync(filePath);
    const dataJSON = dataBuffer.toString();
    try {
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
}

// Function to save notes array into the JSON file
function saveNotes(notes) {
    fs.writeFileSync(filePath, JSON.stringify(notes, null, 2));
}

// Handle command line arguments
const args = process.argv.slice(2);
const command = args[0];
const noteText = args[1];

if (command === 'add') {
    if (!noteText) {
        console.log('Error: Please provide note text! Example: node index.js add "Your note here"');
        process.exit(1);
    }
    const notes = getNotes();
    
    // Creating a note object with ID, text, and date stamp
    const newNote = {
        id: Date.now().toString(),
        text: noteText,
        date: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes(notes);
    console.log('Success: Note has been saved successfully in JSON file!');

} else if (command === 'list') {
    const notes = getNotes();
    console.log('--- Your Notes List ---');
    if (notes.length === 0) {
        console.log('No notes found.');
    }
    notes.forEach((note, index) => {
        console.log(`${index + 1}. ${note.text} (Date: ${note.date})`);
    });

} else if (command === 'delete') {
    // Delete note by its index number
    const noteIndexInput = args[1];
    let notes = getNotes();
    const index = parseInt(noteIndexInput) - 1;
    
    if (index >= 0 && index < notes.length) {
        const removed = notes.splice(index, 1);
        saveNotes(notes);
        console.log(`Success: Deleted note -> "${removed[0].text}"`);
    } else {
        console.log('Error: Please provide a valid note number from the list.');
    }

} else if (command === 'search') {
    // Search notes containing specific keywords
    const keyword = args[1];
    if (!keyword) {
        console.log('Error: Please provide a search keyword! Example: node index.js search "keyword"');
        process.exit(1);
    }
    const notes = getNotes();
    const matchedNotes = notes.filter(note => note.text.toLowerCase().includes(keyword.toLowerCase()));
    
    console.log(`--- Search Results for "${keyword}" ---`);
    if (matchedNotes.length === 0) {
        console.log('No matching notes found.');
    }
    matchedNotes.forEach((note, index) => {
        console.log(`${index + 1}. ${note.text} (Date: ${note.date})`);
    });

} else {
    console.log('Invalid command! Use one of the following:');
    console.log('  node index.js add "Your note text"');
    console.log('  node index.js list');
    console.log('  node index.js delete <note number>');
    console.log('  node index.js search "<keyword>"');
}