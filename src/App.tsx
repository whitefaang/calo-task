import Navbar from "./components/Navbar";
import NotificationProvider from "./contexts/NotificationProvider";
import Dashboard from "./pages/Dashboard";

/**
 * App Component.
 * Entry point of app.
 */
function App() {
  return (
    // notification provider used to show notification down the line
    <NotificationProvider>
      <main className="h-full flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <Dashboard />
        </div>
      </main>
    </NotificationProvider>
  );
}

export default App;
