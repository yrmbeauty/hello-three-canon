import ThemeProvider from "./providers/ThemeProvider";
import Home from "pages/Home/Home";

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <Home />
    </ThemeProvider>
  );
};

export default App;
