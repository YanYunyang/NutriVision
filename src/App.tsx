/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { NutritionProvider } from './store/NutritionContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Camera } from './pages/Camera';
import { Insights } from './pages/Insights';
import { Discover } from './pages/Discover';
import { Profile } from './pages/Profile';

export default function App() {
  return (
    <NutritionProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="insights" element={<Insights />} />
            <Route path="discover" element={<Discover />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="/camera" element={<Camera />} />
        </Routes>
      </BrowserRouter>
    </NutritionProvider>
  );
}
