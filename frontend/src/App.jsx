import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import LandingPage from "./pages/LandingPage";
import SwipeFeed from "./pages/SwipeFeed";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import GeminiChat from "./GeminiChat";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/feed" element={<SwipeFeed />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>

                {/* Floating assistant visible on all pages */}
                <GeminiChat />
            </Router>
        </QueryClientProvider>
    );
}

export default App;
