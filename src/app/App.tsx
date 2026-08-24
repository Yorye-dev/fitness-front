import { useEffect } from "react";
import { RouterProvider } from "react-router-dom";

import { useAuthStore } from "@/features/auth/stores/auth.store";
import { router } from "./router";

function App() {
  const initialize = useAuthStore((state) => state.initialize);

  useEffect(() => {
    void initialize();
  }, [initialize]);

  return <RouterProvider router={router} />;
}

export default App;
