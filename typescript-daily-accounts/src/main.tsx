import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/AppLayout';
import { BrowserRouter, Routes, Route } from "react-router";
import SettingsPanel from './pages/SettingsPanel';
import { MyThemeProvider } from './theme/theme';
import ChartsPanel from './pages/ChartsPanel';
import { registerCharts } from './pages/chart-setup';

registerCharts();

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

root.render(
    <React.StrictMode>
        <MyThemeProvider>
                <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />} />
                    <Route path="/home" element={<App />} />
                    <Route path="/settings" element={<SettingsPanel />} />
                    <Route path="/charts" element={<ChartsPanel />} />
                </Routes>
            </BrowserRouter>
        </MyThemeProvider>
       </React.StrictMode>
);