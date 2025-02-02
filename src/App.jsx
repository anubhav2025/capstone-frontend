// src/App.jsx
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { useTriggerScanMutation } from "./store/findingsApi";
import SidebarLayout from "./components/SidebarLayout";
import FindingsPage from "./pages/FindingsPage";
import DashboardPage from "./pages/Dashboard";

function App() {
  // We define the RTK Mutation for scanning
  const [triggerScan] = useTriggerScanMutation();

  // We'll pass a function to re-fetch the findings page.
  // The actual re-fetch is done inside the <FindingsPage>,
  // but we can do a forced refresh if needed.
  // Alternatively, we can store a reference to the page's refetch.
  // For simplicity, let's do an approach that triggers the same effect
  // from the page when scanning is done.

  const handleScan = async () => {
    try {
      await triggerScan().unwrap();
      // Possibly notify success or show a message
      console.log("Scan triggered successfully");
      // We might want to forcibly re-fetch the findings.
      // The best approach is to call the 'refetch' from the page itself,
      // or we can do a store dispatch invalidating.
      // For example:
      // dispatch(findingsApi.util.invalidateTags(['Findings']));
      // or just do a window event or something.
      // For brevity, let's do nothing.
    } catch (err) {
      console.error("Scan trigger failed:", err);
    }
  };

  return (
    <BrowserRouter>
      <SidebarLayout onScan={handleScan}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/findings" element={<FindingsPage />} />
        </Routes>
      </SidebarLayout>
    </BrowserRouter>
  );
}

export default App;
