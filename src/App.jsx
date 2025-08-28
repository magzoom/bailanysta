import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, Heart, MessageCircle, Search, Sun, Moon, Plus, Home, Settings, Sparkles, Send, Edit3, Trash2 } from 'lucide-react';

// Контекст для темы
const ThemeContext = createContext();

// Контекст для данных приложения
const AppContext = createContext();

// Главный компонент
const BailanystaApp = () => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  const [currentUser, setCurrentUser] = useState({
    id: '1',
    username: 'bailanysta_user',
    displayName: 'Bailanysta User',
    bio: 'Добро пожаловать в Bailanysta! 🚀',
    avatar: '👤',
    followers: 142,
    following: 89
  });

  const [users] = useState([
    {
      id: '1',
      username: 'bailanysta_user',
      displayName: 'Bailanysta User',
      bio: 'Добро пожаловать в Bailanysta! 🚀',
      avatar: '👤'
    },
    {
      id: '2',
      username: 'tech_guru',
      displayName: 'Tech Guru',
      bio: 'Разработчик и любитель новых технологий',
      avatar: '👨‍💻'
    },
    {
      id: '3',
      username: 'creative_soul',
      displayName: 'Creative Soul',
      bio: 'Художник и дизайнер',
      avatar: '🎨'
    }
  ]);

  const [posts, setPosts] = useState([
    {
      id: '1',
      userId: '2',
      content: 'Только что запустил новый проект на React! Очень доволен результатом 🚀',
      timestamp: Date.now() - 3600000,
      likes: ['1', '3'],
      comments: [
        { id: '1', userId: '1', content: 'Поздравляю! Выглядит отлично!', timestamp: Date.now() - 3500000 }
      ]
    },
    {
      id: '2',
      userId: '3',
      content: 'Работаю над новым дизайном приложения. Что думаете о минималистичном подходе? #design #ui',
      timestamp: Date.now() - 7200000,
      likes: ['1', '2'],
      comments: []
    },
    {
      id: '3',
      userId: '1',
      content: 'Добро пожаловать в Bailanysta - новую социальную платформу! Здесь мы делимся идеями и вдохновением ✨',
      timestamp: Date.now() - 10800000,
      likes: ['2', '3'],
      comments: [
        { id: '2', userId: '2', content: 'Отличная платформа!', timestamp: Date.now() - 10000000 },
        { id: '3', userId: '3', content: 'Уже тестирую все функции 👍', timestamp: Date.now() - 9500000 }
      ]
    }
  ]);

  const [currentPage, setCurrentPage] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Применение темы к body
  useEffect(() => {
    if (currentTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setCurrentTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const addPost = (content) => {
    const newPost = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: content,
      timestamp: Date.now(),
      likes: [],
      comments: []
    };
    setPosts([newPost, ...posts]);
  };

  const toggleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const hasLiked = post.likes.includes(currentUser.id);
        return {
          ...post,
          likes: hasLiked 
            ? post.likes.filter(id => id !== currentUser.id)
            : [...post.likes, currentUser.id]
        };
      }
      return post;
    }));
  };

  const addComment = (postId, content) => {
    const newComment = {
      id: Date.now().toString(),
      userId: currentUser.id,
      content: content,
      timestamp: Date.now()
    };
    
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          comments: [...post.comments, newComment]
        };
      }
      return post;
    }));
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const generateAIContent = async () => {
    setIsLoading(true);
    try {
      // Симуляция AI генерации контента
      const aiTopics = [
        "Искусственный интеллект меняет мир вокруг нас каждый день! 🤖 Какие возможности он откроет завтра?",
        "Размышляю о будущем технологий... Квантовые компьютеры, нейроинтерфейсы - что из этого станет реальностью первым? 🚀",
        "Творчество и технологии - две стороны одной медали. Как AI помогает раскрыть человеческий потенциал? ✨",
        "Социальные сети эволюционируют. Что, если бы мы могли делиться не только мыслями, но и эмоциями? 💭",
        "Экологические технологии - это не просто тренд, это необходимость нашего времени 🌱"
      ];
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      const randomTopic = aiTopics[Math.floor(Math.random() * aiTopics.length)];
      addPost(`🤖 AI-генерация: ${randomTopic}`);
    } catch (error) {
      console.error('Ошибка генерации контента:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const user = users.find(u => u.id === post.userId);
    return post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
           user?.displayName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const appContextValue = {
    currentUser,
    users,
    posts,
    setPosts,
    addPost,
    toggleLike,
    addComment,
    deletePost,
    generateAIContent,
    isLoading,
    filteredPosts,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage
  };

  return (
    <ThemeContext.Provider value={{ theme: currentTheme, toggleTheme }}>
      <AppContext.Provider value={appContextValue}>
        <div className={`min-h-screen transition-all duration-300 ${
          currentTheme === 'dark' 
            ? 'bg-gray-900 text-white' 
            : 'bg-gray-50 text-gray-900'
        }`}>
          <div className="max-w-4xl mx-auto">
            <Header />
            <main className="px-4 pb-8">
              {currentPage === 'feed' && <FeedPage />}
              {currentPage === 'profile' && <ProfilePage />}
              {currentPage === 'search' && <SearchPage />}
            </main>
          </div>
        </div>
      </AppContext.Provider>
    </ThemeContext.Provider>
  );
};

// Компонент шапки
const Header = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { currentPage, setCurrentPage, searchQuery, setSearchQuery } = useContext(AppContext);

  return (
    <header className={`sticky top-0 z-50 ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } border-b backdrop-blur-sm bg-opacity-95`}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Bailanysta
            </h1>
            
            {currentPage === 'search' && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск постов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-10 pr-4 py-2 rounded-lg border ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'hover:bg-gray-700 text-yellow-500' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Navigation />
          </div>
        </div>
      </div>
    </header>
  );
};

// Компонент навигации
const Navigation = () => {
  const { theme } = useContext(ThemeContext);
  const { currentPage, setCurrentPage } = useContext(AppContext);

  const navItems = [
    { id: 'feed', icon: Home, label: 'Лента' },
    { id: 'search', icon: Search, label: 'Поиск' },
    { id: 'profile', icon: User, label: 'Профиль' }
  ];

  return (
    <nav className="flex space-x-2">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setCurrentPage(item.id)}
          className={`p-2 rounded-lg transition-colors ${
            currentPage === item.id
              ? 'bg-blue-500 text-white'
              : theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-600'
          }`}
          title={item.label}
        >
          <item.icon className="h-5 w-5" />
        </button>
      ))}
    </nav>
  );
};

// Страница ленты
const FeedPage = () => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Добро пожаловать в Bailanysta!</h2>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Делитесь мыслями и находите вдохновение
        </p>
      </div>
      
      <CreatePost />
      <PostList />
    </div>
  );
};

// Компонент создания поста
const CreatePost = () => {
  const { theme } = useContext(ThemeContext);
  const { addPost, generateAIContent, isLoading, currentUser } = useContext(AppContext);
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      addPost(content);
      setContent('');
    }
  };

  return (
    <div className={`p-6 rounded-xl border animate-fade-in ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="text-2xl">{currentUser.avatar}</div>
        <div className="flex-1">
          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="О чём думаете?"
              rows="3"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleSubmit(e);
                }
              }}
              className={`w-full p-3 rounded-lg border resize-none ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <div className="flex items-center justify-between mt-3">
              <button
                type="button"
                onClick={generateAIContent}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700'
                } text-white`}
              >
                <Sparkles className="h-4 w-4" />
                <span>{isLoading ? 'Генерируется...' : 'AI Контент'}</span>
              </button>
              
              <button
                onClick={handleSubmit}
                disabled={!content.trim()}
                className={`px-6 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  content.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="h-4 w-4" />
                <span>Опубликовать</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Список постов
const PostList = () => {
  const { filteredPosts } = useContext(AppContext);

  return (
    <div className="space-y-4">
      {filteredPosts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Постов не найдено</p>
        </div>
      )}
    </div>
  );
};

// Карточка поста
const PostCard = ({ post }) => {
  const { theme } = useContext(ThemeContext);
  const { users, currentUser, toggleLike, addComment, deletePost } = useContext(AppContext);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const author = users.find(user => user.id === post.userId);
  const isLiked = post.likes.includes(currentUser.id);
  const canDelete = post.userId === currentUser.id;

  const handleComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const formatTime = (timestamp) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}д назад`;
    if (hours > 0) return `${hours}ч назад`;
    return `${minutes}м назад`;
  };

  return (
    <article className={`p-6 rounded-xl border animate-fade-in ${
      theme === 'dark' 
        ? 'bg-gray-800 border-gray-700' 
        : 'bg-white border-gray-200'
    } hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="text-2xl">{author?.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold">{author?.displayName}</h3>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                @{author?.username} · {formatTime(post.timestamp)}
              </span>
            </div>
            <p className="mt-2 whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
        
        {canDelete && (
          <button
            onClick={() => deletePost(post.id)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Удалить пост"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <button
          onClick={() => toggleLike(post.id)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
            isLiked 
              ? 'text-red-500 bg-red-50 dark:bg-red-900/20' 
              : theme === 'dark'
                ? 'hover:bg-gray-700 text-gray-400'
                : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors ${
            theme === 'dark' 
              ? 'hover:bg-gray-700 text-gray-400' 
              : 'hover:bg-gray-100 text-gray-500'
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>{post.comments.length}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          <div className="flex space-x-3">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleComment(e);
                }
              }}
              placeholder="Написать комментарий..."
              className={`flex-1 px-3 py-2 rounded-lg border ${
                theme === 'dark' 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            <button
              onClick={handleComment}
              disabled={!commentText.trim()}
              className={`px-4 py-2 rounded-lg transition-colors ${
                commentText.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            {post.comments.map((comment) => {
              const commentAuthor = users.find(user => user.id === comment.userId);
              return (
                <div key={comment.id} className="flex space-x-3">
                  <div className="text-xl">{commentAuthor?.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm">{commentAuthor?.displayName}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTime(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
};

// Страница профиля
const ProfilePage = () => {
  const { theme } = useContext(ThemeContext);
  const { currentUser, posts } = useContext(AppContext);
  
  const userPosts = posts.filter(post => post.userId === currentUser.id);
  
  return (
    <div className="space-y-6">
      <div className={`p-6 rounded-xl border animate-fade-in ${
        theme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="flex items-start space-x-4">
          <div className="text-4xl">{currentUser.avatar}</div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{currentUser.displayName}</h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}>
              @{currentUser.username}
            </p>
            <p className="mb-4">{currentUser.bio}</p>
            <div className="flex space-x-6 text-sm">
              <div>
                <span className="font-bold">{currentUser.following}</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}> подписок</span>
              </div>
              <div>
                <span className="font-bold">{currentUser.followers}</span>
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}> подписчиков</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Мои посты ({userPosts.length})</h2>
        <div className="space-y-4">
          {userPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {userPosts.length === 0 && (
            <div className="text-center py-12">
              <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                У вас пока нет постов
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Страница поиска
const SearchPage = () => {
  const { theme } = useContext(ThemeContext);
  const { filteredPosts, searchQuery } = useContext(AppContext);

  return (
    <div className="space-y-6">
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold mb-2">Поиск</h2>
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          Найдите интересные посты и пользователей
        </p>
      </div>

      {searchQuery && (
        <div>
          <h3 className="text-lg font-semibold mb-4">
            Результаты поиска для "{searchQuery}" ({filteredPosts.length})
          </h3>
        </div>
      )}

      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {searchQuery && filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              По запросу "{searchQuery}" ничего не найдено
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BailanystaApp;
