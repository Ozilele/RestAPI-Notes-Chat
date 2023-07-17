import './App.css';
import Header from './components/Header/Header';
import AddIcon from '@mui/icons-material/Add';
import AllNotes from './pages/AllNotes';
import NewNoteForm from './components/Form/NewNoteForm';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useRoutes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SearchField from './components/Filter/SearchField';
import FilterBox from './components/Filter/FilterBox';
import ChatPage from './pages/ChatPage';

const HomePage = () => {

  const [app_class, setAppClass] = useState("App");
  const [filteredBoxOpen, setFilteredBoxOpen] = useState(false);

  const handleOnClick = (e) => {
    const newClass = app_class === "App" ? "App overlay" : "App";
    setAppClass(newClass);
  }

  return (
    <motion.div 
      className={app_class}
      // initial={{ x: 300, opacity: 0.75 }}
      // animate={{ x: 0, opacity: 1 }}
      // exit={{ x: 300, opacity: 0 }}
      // initial={{width: 0}}
      // animate={{width: "100%"}}
      // exit={{x: "100%", opacity: 0}}
      // transition={{ duration: 0.75 }}
      initial={{ width: 0 }}
      animate={{ width: "100%" }}
      exit={{ x: "-100%", opacity: 0 }}
      transition={{ duration: 1, type: "spring", mass: 0.3 }}
      // transition={{ type: 'spring', mass: 0.4 }}
      // animate={{scaleY: 1}}
      // exit={{scaleZ: 0}}
      // transition={{type: 'spring', stiffness: 250, damping: 21}}
    >
      <Header/>
      <SearchField box={filteredBoxOpen} setOpen={setFilteredBoxOpen}/>
      <AllNotes/>
      {filteredBoxOpen && <FilterBox/>}
      <div className="add-btn-container">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleOnClick} 
          className="insert-btn">
            <AddIcon className="add-icon"/>
        </motion.button>
      </div>
      <AnimatePresence>
        {app_class == "App overlay" &&
          <NewNoteForm setModalClass={setAppClass} />
        }
      </AnimatePresence>
    </motion.div>
  );
}

function App() {

  const element = useRoutes([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/login",
      element: (
        <LoginPage/>
      )
    },
    {
      path: "/chat",
      element: (
        <ChatPage/>
      )
    },
    {
      path: '/note',
      element: (
        <HomePage/>
      )
    }
  ]);

  const location = useLocation();
  if (!element) return null;

  return (
    // <>
    //   <RouterProvider router={router}></RouterProvider>
    // </>
    <AnimatePresence mode='wait'>
      {React.cloneElement(element, { key: location.pathname })}
    </AnimatePresence>
  );
}


export default App;
