import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../ui/DashboardLayout";
import { 
  Search,
  BookOpen,
  FileText,
  Clock,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  Star,
  Eye,
  MapPin,
  User,
  Calendar,
  Wrench,
  Shield,
  Network,
  Printer,
  Mail,
  HardDrive,
  Wifi,
  Lock,
  Monitor,
  Server,
  Cloud
} from "lucide-react";

const knowledgeArticles = [
  {
    id: 1,
    title: "VPN Connection Guide for Court Networks",
    excerpt: "Learn how to connect to the secure VPN network required for accessing e-filing systems and court records. Step-by-step instructions for government legal professionals.",
    category: "Network",
    readTime: "8 min read",
    date: "Mar 15, 2026",
    views: 1245,
    featured: true,
    icon: Wifi,
    color: "blue"
  },
  {
    id: 2,
    title: "Troubleshooting Legal Case Management Software",
    excerpt: "Common issues with case management systems and how to resolve them. Includes fixes for crashes, file upload errors, and performance optimization.",
    category: "Software",
    readTime: "12 min read",
    date: "Mar 12, 2026",
    views: 892,
    featured: true,
    icon: Monitor,
    color: "purple"
  },
  {
    id: 3,
    title: "Network Printer Setup and Troubleshooting",
    excerpt: "Complete guide to setting up and troubleshooting network printers in law offices and government buildings. Covers driver installation and common error codes.",
    category: "Hardware",
    readTime: "6 min read",
    date: "Mar 10, 2026",
    views: 654,
    featured: false,
    icon: Printer,
    color: "green"
  },
  {
    id: 4,
    title: "Secure Email Configuration for Court Notifications",
    excerpt: "Configure your email client to receive secure court notifications and legal communications. Setup guides for Outlook, Gmail, and government email systems.",
    category: "Security",
    readTime: "10 min read",
    date: "Mar 8, 2026",
    views: 723,
    featured: false,
    icon: Mail,
    color: "amber"
  },
  {
    id: 5,
    title: "Scanner Calibration for Evidence Digitization",
    excerpt: "High-resolution scanner setup and calibration guide for digitizing physical evidence. Includes maintenance tips and common calibration issues.",
    category: "Hardware",
    readTime: "7 min read",
    date: "Mar 5, 2026",
    views: 445,
    featured: false,
    icon: HardDrive,
    color: "indigo"
  },
  {
    id: 6,
    title: "Account Access and Authentication Issues",
    excerpt: "Troubleshooting guide for login problems, password resets, and two-factor authentication setup. Keep your legal accounts secure and accessible.",
    category: "Security",
    readTime: "9 min read",
    date: "Mar 3, 2026",
    views: 567,
    featured: false,
    icon: Lock,
    color: "red"
  },
  {
    id: 7,
    title: "Network Infrastructure Best Practices",
    excerpt: "Essential network setup guidelines for law firms and government offices. Ensure reliable connectivity for critical legal operations.",
    category: "Network",
    readTime: "15 min read",
    date: "Feb 28, 2026",
    views: 389,
    featured: false,
    icon: Network,
    color: "cyan"
  },
  {
    id: 8,
    title: "Cloud Storage Solutions for Legal Documents",
    excerpt: "Secure cloud storage options for storing and sharing legal documents. Compliance considerations and recommended providers.",
    category: "Software",
    readTime: "11 min read",
    date: "Feb 25, 2026",
    views: 512,
    featured: false,
    icon: Cloud,
    color: "sky"
  },
  {
    id: 9,
    title: "Server Maintenance for Law Firm IT",
    excerpt: "Regular maintenance tasks for law firm servers. Performance monitoring, backups, and security updates.",
    category: "Hardware",
    readTime: "14 min read",
    date: "Feb 22, 2026",
    views: 298,
    featured: false,
    icon: Server,
    color: "slate"
  }
];

const categories = [
  { id: "all", name: "All Articles", count: 9, icon: BookOpen },
  { id: "network", name: "Network", count: 2, icon: Wifi },
  { id: "software", name: "Software", count: 2, icon: Monitor },
  { id: "hardware", name: "Hardware", count: 3, icon: HardDrive },
  { id: "security", name: "Security", count: 2, icon: Shield },
];

const KnowledgeBasePage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const filteredArticles = knowledgeArticles.filter(article => {
    const matchesSearch = !searchQuery || 
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = filteredArticles.filter(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured);

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const getCategoryColor = (color) => {
    const colors = {
      blue: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
      purple: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
      green: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
      indigo: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400",
      red: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
      cyan: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
      sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
      slate: "bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400",
    };
    return colors[color] || colors.blue;
  };

  const getCategoryIconBg = (color) => {
    const colors = {
      blue: "bg-blue-500",
      purple: "bg-purple-500",
      green: "bg-green-500",
      amber: "bg-amber-500",
      indigo: "bg-indigo-500",
      red: "bg-red-500",
      cyan: "bg-cyan-500",
      sky: "bg-sky-500",
      slate: "bg-slate-500",
    };
    return colors[color] || colors.blue;
  };

  if (selectedArticle) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-6 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Articles</span>
          </button>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(selectedArticle.color)}`}>
                  {selectedArticle.category}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock size={12} />
                  {selectedArticle.readTime}
                </span>
              </div>

              <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${getCategoryIconBg(selectedArticle.color)} shadow-lg`}>
                <selectedArticle.icon size={28} className="text-white" />
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {selectedArticle.title}
              </h1>

              <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-100 dark:border-gray-700">
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {selectedArticle.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye size={14} />
                  {selectedArticle.views} views
                </span>
                <span className="flex items-center gap-1.5">
                  <User size={14} />
                  IT Support Team
                </span>
              </div>

              <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                  {selectedArticle.excerpt}
                </p>
                
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 sm:p-6 mb-6">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                    Article Overview
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    This comprehensive guide covers essential information for government and legal professionals 
                    dealing with ICT challenges in their daily operations. Follow the steps below to resolve 
                    common issues and optimize your workflow.
                  </p>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-8">
                  Prerequisites
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                  <li>System administrator access (if required)</li>
                  <li>Current software versions documented</li>
                  <li>Network configuration details</li>
                  <li>Support contact information</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 mt-8">
                  Step-by-Step Solution
                </h3>
                <div className="space-y-4 mb-6">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Identify the Issue</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Carefully document the symptoms and when they occur.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Check Basic Requirements</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Verify network connectivity and system requirements.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Apply Solution</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Follow the detailed steps outlined in this guide.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Verify Resolution</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Test the system to confirm the issue is resolved.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 sm:p-6 mb-6">
                  <h3 className="text-base font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Wrench size={18} />
                    Need More Help?
                  </h3>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    If this guide doesn't resolve your issue, please submit a support ticket through the dashboard.
                  </p>
                  <button
                    onClick={() => navigate("/client-dashboard/new-ticket")}
                    className="mt-3 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Submit Support Ticket
                  </button>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Hero Section */}
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Knowledge Base
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive guides and articles to help you resolve common ICT challenges 
              in government and legal environments.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm text-sm sm:text-base"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? "bg-primary/10 text-primary dark:bg-primary/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <category.icon size={18} />
                      <span className="text-sm font-medium">{category.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category.id
                        ? "bg-primary text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                  Quick Links
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => navigate("/client-dashboard/new-ticket")}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors text-sm"
                  >
                    <FileText size={18} />
                    Submit a Ticket
                  </button>
                  <button
                    onClick={() => navigate("/help-support")}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 transition-colors text-sm"
                  >
                    <BookOpen size={18} />
                    Help Center
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                  <Star size={20} className="text-amber-500" />
                  Featured Articles
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {featuredArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleArticleClick(article)}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 cursor-pointer hover:shadow-xl hover:border-primary/30 transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${getCategoryColor(article.color)}`}>
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                          <Eye size={12} />
                          {article.views}
                        </span>
                      </div>
                      
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${getCategoryIconBg(article.color)} shadow-lg group-hover:scale-110 transition-transform`}>
                        <article.icon size={24} className="text-white" />
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {article.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {article.date}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* All Articles */}
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
                <BookOpen size={20} className="text-primary" />
                {selectedCategory === "all" ? "All Articles" : `${categories.find(c => c.id === selectedCategory)?.name || selectedCategory} Articles`}
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                  ({regularArticles.length})
                </span>
              </h2>
              
              {filteredArticles.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <BookOpen size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p className="text-gray-500 dark:text-gray-400">No articles found matching your search.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {regularArticles.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => handleArticleClick(article)}
                      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 cursor-pointer hover:shadow-lg hover:border-primary/20 transition-all group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryIconBg(article.color)} shadow-sm group-hover:scale-110 transition-transform`}>
                          <article.icon size={18} className="text-white sm:w-5 sm:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${getCategoryColor(article.color)}`}>
                              {article.category}
                            </span>
                          </div>
                          <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 group-hover:text-primary transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-3 text-[10px] sm:text-xs text-gray-400 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock size={10} />
                              {article.readTime}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye size={10} />
                              {article.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={10} />
                              {article.date}
                            </span>
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-400 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default KnowledgeBasePage;
