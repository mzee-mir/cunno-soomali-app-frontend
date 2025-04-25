import React from 'react';
import ReactDOM from 'react-dom/client';
import "./global.css";

import { BrowserRouter as Router } from 'react-router-dom';
import AppRoute from './AppRouter';
import { Toaster } from 'sonner';
import { Provider } from 'react-redux'
import store from './store/store';
import Auth0ProvideWithNavigate from './auth/Auth0ProvideWithNavigate';
import { QueryClient, QueryClientProvider } from 'react-query';
import { GlobalProvider } from './Provider/Global';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 2, // Retry failed queries 2 times
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
<React.StrictMode>
<Provider store={store}>
<QueryClientProvider client={queryClient}>
  <Router>  
  <Auth0ProvideWithNavigate>
        <GlobalProvider>
          <AppRoute/>
          <Toaster visibleToasts={1} position="top-right" richColors/>
        </GlobalProvider>
      </Auth0ProvideWithNavigate>
  </Router>
  </QueryClientProvider>
</Provider>
</React.StrictMode>,
);
