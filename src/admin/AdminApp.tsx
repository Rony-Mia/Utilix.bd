import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './context/AdminAuthContext.tsx';
import { AdminLayout } from './AdminLayout.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { BlogPostsListPage } from './pages/BlogPostsListPage.tsx';
import { BlogPostEditorPage } from './pages/BlogPostEditorPage.tsx';
import { CategoriesManagerPage } from './pages/CategoriesManagerPage.tsx';
import { TagsManagerPage } from './pages/TagsManagerPage.tsx';
import { MediaLibraryPage } from './pages/MediaLibraryPage.tsx';
import { HomepageBlogManagerPage } from './pages/HomepageBlogManagerPage.tsx';
import { ToolsManagerPage } from './pages/ToolsManagerPage.tsx';
import { SeoRedirectsPage } from './pages/SeoRedirectsPage.tsx';
import { UsersRolesPage } from './pages/UsersRolesPage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';

export const AdminApp: React.FC = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="posts" element={<BlogPostsListPage />} />
          <Route path="posts/new" element={<BlogPostEditorPage />} />
          <Route path="posts/edit/:slug" element={<BlogPostEditorPage />} />
          <Route path="categories" element={<CategoriesManagerPage />} />
          <Route path="tags" element={<TagsManagerPage />} />
          <Route path="media" element={<MediaLibraryPage />} />
          <Route path="homepage" element={<HomepageBlogManagerPage />} />
          <Route path="tools" element={<ToolsManagerPage />} />
          <Route path="seo" element={<SeoRedirectsPage />} />
          <Route path="users" element={<UsersRolesPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};
