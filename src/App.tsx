import './App.css';
import BoardPage from './components/pages/BoardPage';
import ResponsiveAppBar from './components/templates/ResponsiveAppBar';

function App() {
  return (
    <>
      <ResponsiveAppBar />
      <BoardPage />
    </>
  );
}

export default App;