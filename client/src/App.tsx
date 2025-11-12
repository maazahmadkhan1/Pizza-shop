import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AnimatePresence, motion } from "framer-motion";
import { CartProvider } from "@/hooks/use-cart";
import { CartPopup } from "@/components/CartPopup";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import Menu from "@/pages/Menu";
import BuildYourOwn from "@/pages/BuildYourOwn";
import About from "@/pages/About";
import Ingredients from "@/pages/Ingredients";
import Contact from "@/pages/Contact";
import Checkout from "@/pages/Checkout";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/menu" component={Menu} />
          <Route path="/build" component={BuildYourOwn} />
          <Route path="/build-your-own" component={BuildYourOwn} />
          <Route path="/about" component={About} />
          <Route path="/ingredients" component={Ingredients} />
          <Route path="/contact" component={Contact} />
          <Route path="/checkout" component={Checkout} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <CartPopup />
          <Toaster />
        </CartProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
