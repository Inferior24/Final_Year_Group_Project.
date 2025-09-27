import React, { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  TrendingUp, 
  Star, 
  Filter,
  Zap,
  Database,
  Code,
  Globe,
  Github,
  Smile,
  Activity
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import SearchInterface from "../components/discovery/SearchInterface";
import CategoryBrowser from "../components/discovery/CategoryBrowser";
import APICard from "../components/discovery/APICard";
import APIDetailModal from "../components/discovery/APIDetailModal";
import TrendingAPIs from "../components/discovery/TrendingAPIs";
import { apiDatabase } from "../components/data/apiDatabase";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedAPI, setSelectedAPI] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [isDark, setIsDark] = useState(true);

  const categories = [
    {
      id: 'content-media',
      name: 'Content & Media',
      description: 'APIs for content, media, and entertainment data',
      icon: Database,
      color: 'from-blue-500 to-cyan-500',
      count: 3
    },
    {
      id: 'data-information', 
      name: 'Data & Information',
      description: 'APIs providing factual data and reference information',
      icon: Globe,
      color: 'from-green-500 to-emerald-500',
      count: 3
    },
    {
      id: 'utility-service',
      name: 'Utility & Service', 
      description: 'APIs for utility functions and enhanced experiences',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      count: 3
    }
  ];

  const trendingAPIs = [
    'jsonplaceholder',
    'github',
    'restcountries', 
    'openweathermap',
    'coingecko'
  ];

  useEffect(() => {
    document.body.className = isDark ? 'dark' : '';
  }, [isDark]);

  const performSearch = (query, category = selectedCategory) => {
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      let results = Object.values(apiDatabase);
      
      // Filter by category
      if (category !== 'all') {
        results = results.filter(api => api.category === category);
      }
      
      // Filter by search query
      if (query.trim()) {
        const searchTerm = query.toLowerCase();
        results = results.filter(api => 
          api.name.toLowerCase().includes(searchTerm) ||
          api.description.toLowerCase().includes(searchTerm) ||
          api.tags?.some(tag => tag.toLowerCase().includes(searchTerm)) ||
          api.useCase?.toLowerCase().includes(searchTerm)
        );
      }
      
      // Sort by popularity
      results.sort((a, b) => b.metadata.popularity - a.metadata.popularity);
      
      setSearchResults(results);
      setIsSearching(false);
    }, 300);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    performSearch(query);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    performSearch(searchQuery, category);
  };

  const toggleFavorite = (apiId) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(apiId)) {
        newSet.delete(apiId);
      } else {
        newSet.add(apiId);
      }
      return newSet;
    });
  };

  const getSuggestions = useCallback((query) => {
    if (!query.trim()) return [];
    
    const suggestions = [];
    const searchTerm = query.toLowerCase();
    
    // API name suggestions
    Object.values(apiDatabase).forEach(api => {
      if (api.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({ type: 'api', text: api.name, icon: Code });
      }
    });
    
    // Category suggestions
    categories.forEach(cat => {
      if (cat.name.toLowerCase().includes(searchTerm)) {
        suggestions.push({ type: 'category', text: cat.name, icon: cat.icon });
      }
    });
    
    return suggestions.slice(0, 6);
  }, [categories]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = getSuggestions(searchQuery);
      setSearchSuggestions(suggestions);
    } else {
      setSearchSuggestions([]);
    }
  }, [searchQuery, getSuggestions]);

  const showingResults = searchQuery.trim() || selectedCategory !== 'all';

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50'
    }`}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? 'bg-purple-500' : 'bg-blue-400'
        } blur-3xl animate-pulse`} />
        <div className={`absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20 ${
          isDark ? 'bg-cyan-500' : 'bg-purple-400'  
        } blur-3xl animate-pulse delay-1000`} />
      </div>

      <div className="relative z-10 p-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center">
              <Search className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-5xl font-bold bg-gradient-to-r ${
              isDark 
                ? 'from-white via-purple-200 to-cyan-200' 
                : 'from-gray-800 via-purple-600 to-blue-600'
            } bg-clip-text text-transparent`}>
              API Discovery Hub
            </h1>
          </div>
          <p className={`text-xl mb-8 ${
            isDark ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Find, compare, and integrate the perfect APIs for your project
          </p>
          
          {/* Main Search Interface */}
          <SearchInterface 
            searchQuery={searchQuery}
            onSearch={handleSearch}
            suggestions={searchSuggestions}
            isDark={isDark}
            isSearching={isSearching}
          />
          
          {/* Quick Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              onClick={() => handleCategoryChange('all')}
              className={selectedCategory === 'all' 
                ? 'bg-gradient-to-r from-purple-600 to-cyan-600 border-0' 
                : `${isDark ? 'border-purple-500/30 text-purple-200 hover:bg-purple-500/10' : 'border-purple-300 text-purple-600 hover:bg-purple-50'}`
              }
            >
              All APIs
            </Button>
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => handleCategoryChange(category.id)}
                className={selectedCategory === category.id 
                  ? `bg-gradient-to-r ${category.color} border-0` 
                  : `${isDark ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`
                }
              >
                <category.icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {showingResults ? (
            /* Search Results */
            <motion.div
              key="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-800'}`}>
                  {searchQuery ? `Search Results for "${searchQuery}"` : `${categories.find(c => c.id === selectedCategory)?.name || 'All'} APIs`}
                </h2>
                <Badge variant="outline" className={`${
                  isDark ? 'border-purple-500/30 text-purple-300' : 'border-purple-300 text-purple-600'
                }`}>
                  {searchResults.length} APIs found
                </Badge>
              </div>
              
              {isSearching ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array(6).fill(0).map((_, i) => (
                    <Card key={i} className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-white/80 border-gray-200/50'} animate-pulse`}>
                      <CardContent className="p-6">
                        <div className="space-y-3">
                          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((api, index) => (
                    <APICard
                      key={api.id}
                      api={api}
                      index={index}
                      isDark={isDark}
                      isFavorite={favorites.has(api.id)}
                      onToggleFavorite={() => toggleFavorite(api.id)}
                      onSelect={() => setSelectedAPI(api)}
                    />
                  ))}
                </div>
              )}
              
              {!isSearching && searchResults.length === 0 && (
                <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-xl font-semibold mb-2">No APIs found</h3>
                  <p>Try adjusting your search terms or browse by category</p>
                </div>
              )}
            </motion.div>
          ) : (
            /* Default Browse Interface */
            <motion.div
              key="browse-interface"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Trending APIs */}
              <TrendingAPIs 
                trendingIds={trendingAPIs}
                apiDatabase={apiDatabase}
                isDark={isDark}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectAPI={setSelectedAPI}
              />
              
              {/* Category Browser */}
              <CategoryBrowser 
                categories={categories}
                apiDatabase={apiDatabase}
                isDark={isDark}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSelectAPI={setSelectedAPI}
                onCategorySelect={handleCategoryChange}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* API Detail Modal */}
      {selectedAPI && (
        <APIDetailModal
          api={selectedAPI}
          isDark={isDark}
          isFavorite={favorites.has(selectedAPI.id)}
          onToggleFavorite={() => toggleFavorite(selectedAPI.id)}
          onClose={() => setSelectedAPI(null)}
          onCompare={(api) => console.log('Compare API:', api)}
        />
      )}
    </div>
  );
}
