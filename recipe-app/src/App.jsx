import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import RecipeDetail from "./pages/RecipeDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateRecipe from "./pages/CreateRecipe";
import EditRecipe from "./pages/EditRecipe";
import Profile from "./pages/Profile";



function App() {
  return (
    
    // <BrowserRouter>
    //   <div className="min-h-screen bg-gray-50 flex flex-col">
    //     <NavBar />
    //     <main className="flex-grow">
    //       <Routes>
    //         <Route path="/" element={<Home />} />
    //         <Route path="/recipe/:id" element={<RecipeDetail />} />
    //         <Route path="/login" element={<Login />} />
    //         <Route path="/register" element={<Register />} />
    //         <Route path="/create" element={<CreateRecipe />} />
    //         <Route path="/edit/:id" element={<EditRecipe />} />
    //         <Route path="/profile/:userId" element={<Profile />} />
    //       </Routes>
    //     </main>
    //     <Footer />
    //   </div>
    // </BrowserRouter>
    <><h1>Hello World</h1></>
  );
}

export default App;
