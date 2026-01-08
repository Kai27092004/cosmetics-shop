import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import ScrollToTopButton from '../common/ScrollToTopButton';

/**
 * MainLayout - Layout chính cho client pages
 * Wrap Header + Content + Footer
 */
export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      <ScrollToTopButton />
    </div>
  );
}