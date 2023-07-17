import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { login, logout } from './userSlice.js';
import Cookies from 'js-cookie';
import { useDispatch } from "react-redux";

// pobieranie danych w module obsługującym asynchroniczne zapytania, asyncThunk do pobrania danych
export const fetchNotes = createAsyncThunk("note/getNotes", async (accessToken, thunkAPI) => {
  const API_URL = "/note";
  const config = {
    headers: {
      Authorization: `Bearer ${accessToken}` // dodanie tokenu do nagłówka zapytania
    }
  }
  const response = await axios.get(API_URL, config);
  console.log(response);
  const { dispatch } = thunkAPI;
  if(response.data.user) {
    dispatch(login(response.data.user));
  }
  return response.data;
});

export const fetchNotesFromTitleName = createAsyncThunk("note/getTitledNotes", async(title) => {
  const API_URL = "/note";
  const response = await axios.get(API_URL + `?title=${title}`);
  console.log(response);
  return response.data;
});

export const fetchSomeNotes = createAsyncThunk("note/getSomeNotes", async (queryObj) => {
  let API_URL = '/note';
  console.log(typeof queryObj);

  if(typeof queryObj === 'string') {
    const response = await axios.get(API_URL + queryObj)
    console.log(response);
    return response.data;
  }
  try {
    const fields = Object.keys(queryObj).length;
  
    if(fields.length === 1) {
      const fieldName = Object.keys(queryObj)[0];
      const fieldValue = queryObj[fieldName];
      API_URL += `?${fieldName}=${fieldValue}`;    
    } else {
      let i = 0;
      for(const fieldName in queryObj) {
        if(i == 0) {
          API_URL += `?${fieldName}=${queryObj[fieldName]}`;
        } else {
          API_URL += `&${fieldName}=${queryObj[fieldName]}`;
        }
        i++;
      }
    }
    const response = await axios.get(API_URL);
    console.log(response); 
    return response.data;
  } catch(err) {
    console.log(err);
  }
});

export const deleteOneNote = createAsyncThunk("note/deleteNote", async (id) => {
  try {
    const API_URL = `/note/${id}`;
    const resp = await axios.delete(API_URL);
    return id;
  } catch(err) {
    console.log(err);
  }
});

export const addNewNote = createAsyncThunk("note/addNote", async (note) => {
  try { 
    const accessToken  = Cookies.get('accessToken');
    const API_URL = "/note"
    const response = await axios.post(API_URL, note, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,// dodanie tokenu do nagłówka zapytania
      }
    });
    console.log(response.data);
    return response.data.newNote;
  } catch(err) {
    console.log(err);
  }
});

export const editOneNote = createAsyncThunk("note/editNote", async (id) => {
  try { 
    const API_URL = `/note/${id}`;
    
  } catch(err) {
    console.log(err);
  }
});

export const noteSlice = createSlice({
  name: "note",
  initialState : {
    allNotes: [],
    author: {},
    status: "idle",
    error: null,
  },
  reducers: {
    addNote : (state, action) => {
      state.allNotes.push(action.payload)
    },
    editNote : (state, action) => {
      const editedNote = action.payload;
      const updatedNotes = state.allNotes.map(note => {
        if(note._id == editedNote._id) {
          return editedNote;
        }
        return note;
      });
      state.allNotes = updatedNotes;
    }, 
    resetNotes: (state, action) => {
      state.allNotes = [];
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchNotes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.status = "succedded";
        state.allNotes = action.payload.notes;
        // state.author = action.payload.user;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.status = "rejected";
        state.error = action.error.message;
      })
      .addCase(fetchSomeNotes.pending, (state, action) => {
        state.allNotes = [];
        state.status = "loading";
      })
      .addCase(fetchSomeNotes.fulfilled, (state, action) => {
        state.status = "succedded";
        state.allNotes = action.payload.notes;
      })
      .addCase(fetchNotesFromTitleName.pending, (state, action) => {
        state.allNotes = [];
        state.status = "loading";
      })
      .addCase(fetchNotesFromTitleName.fulfilled, (state, action) => {
        state.status = "succedded";
        state.allNotes = action.payload.notes;
      })

      .addCase(deleteOneNote.fulfilled, (state, action) => {
        const deletedNoteID = action.payload;
        state.allNotes = state.allNotes.filter(note => note._id != deletedNoteID);
      })

      .addCase(addNewNote.fulfilled, (state, action) => {
        state.allNotes.unshift(action.payload);
      })
  },
});

export const { addNote, editNote, resetNotes } = noteSlice.actions;
export const selectNotes = (state) => state.note.allNotes;
export const selectState = (state) => state.note.status;
export const selectNoteAuthor = (state) => state.note.author;

export default noteSlice.reducer;
