// vite.config.ts
import { defineConfig } from "file:///C:/Users/udayb/Downloads/MediScan-AI-main/MediScan-AI-main%20-%20Full%20-%20New/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/udayb/Downloads/MediScan-AI-main/MediScan-AI-main%20-%20Full%20-%20New/frontend/node_modules/@vitejs/plugin-react-swc/index.js";
import path from "path";
import { viteSourceLocator } from "file:///C:/Users/udayb/Downloads/MediScan-AI-main/MediScan-AI-main%20-%20Full%20-%20New/frontend/node_modules/@metagptx/vite-plugin-source-locator/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\udayb\\Downloads\\MediScan-AI-main\\MediScan-AI-main - Full - New\\frontend";
var vite_config_default = defineConfig(({ mode }) => ({
  plugins: [
    viteSourceLocator({
      prefix: "mgx"
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-select"],
          "vendor-animation": ["framer-motion"]
        }
      }
    },
    chunkSizeWarningLimit: 1e3
    // Suppress warning
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx1ZGF5YlxcXFxEb3dubG9hZHNcXFxcTWVkaVNjYW4tQUktbWFpblxcXFxNZWRpU2Nhbi1BSS1tYWluIC0gRnVsbCAtIE5ld1xcXFxmcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcdWRheWJcXFxcRG93bmxvYWRzXFxcXE1lZGlTY2FuLUFJLW1haW5cXFxcTWVkaVNjYW4tQUktbWFpbiAtIEZ1bGwgLSBOZXdcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3VkYXliL0Rvd25sb2Fkcy9NZWRpU2Nhbi1BSS1tYWluL01lZGlTY2FuLUFJLW1haW4lMjAtJTIwRnVsbCUyMC0lMjBOZXcvZnJvbnRlbmQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IHJlYWN0IGZyb20gXCJAdml0ZWpzL3BsdWdpbi1yZWFjdC1zd2NcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgeyB2aXRlU291cmNlTG9jYXRvciB9IGZyb20gXCJAbWV0YWdwdHgvdml0ZS1wbHVnaW4tc291cmNlLWxvY2F0b3JcIjtcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+ICh7XG4gIHBsdWdpbnM6IFtcbiAgICB2aXRlU291cmNlTG9jYXRvcih7XG4gICAgICBwcmVmaXg6IFwibWd4XCIsXG4gICAgfSksXG4gICAgcmVhY3QoKSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKSxcbiAgICB9LFxuICB9LFxuICBidWlsZDoge1xuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICBtYW51YWxDaHVua3M6IHtcbiAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nLCAncmVhY3Qtcm91dGVyLWRvbSddLFxuICAgICAgICAgICd2ZW5kb3ItdWknOiBbJ0ByYWRpeC11aS9yZWFjdC1kaWFsb2cnLCAnQHJhZGl4LXVpL3JlYWN0LWRyb3Bkb3duLW1lbnUnLCAnQHJhZGl4LXVpL3JlYWN0LXNlbGVjdCddLFxuICAgICAgICAgICd2ZW5kb3ItYW5pbWF0aW9uJzogWydmcmFtZXItbW90aW9uJ10sXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCwgLy8gU3VwcHJlc3Mgd2FybmluZ1xuICB9XG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdiLFNBQVMsb0JBQW9CO0FBQ3JkLE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFDakIsU0FBUyx5QkFBeUI7QUFIbEMsSUFBTSxtQ0FBbUM7QUFNekMsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE9BQU87QUFBQSxFQUN6QyxTQUFTO0FBQUEsSUFDUCxrQkFBa0I7QUFBQSxNQUNoQixRQUFRO0FBQUEsSUFDVixDQUFDO0FBQUEsSUFDRCxNQUFNO0FBQUEsRUFDUjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQywwQkFBMEIsaUNBQWlDLHdCQUF3QjtBQUFBLFVBQ2pHLG9CQUFvQixDQUFDLGVBQWU7QUFBQSxRQUN0QztBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSx1QkFBdUI7QUFBQTtBQUFBLEVBQ3pCO0FBQ0YsRUFBRTsiLAogICJuYW1lcyI6IFtdCn0K
