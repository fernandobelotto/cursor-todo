import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { cn } from "./lib/utils";
import "./App.css";
import { FilterTabs } from "./FilterTabs";

export type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export type Filter = "all" | "active" | "completed";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("todos");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<Filter>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("filter") as Filter) || "all";
    }
    return "all";
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("darkMode") === "true" ||
        window.matchMedia("(prefers-color-scheme: dark)").matches
      );
    }
    return false;
  });

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Save filter to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("filter", filter);
  }, [filter]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark((prev) => !prev);
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;

    const todo: Todo = {
      id: crypto.randomUUID(),
      text: newTodo.trim(),
      completed: false,
    };

    setTodos((prev) => [todo, ...prev]);
    setNewTodo("");
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditText(todo.text);
  };

  const saveEdit = () => {
    if (!editText.trim() || !editingId) return;

    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === editingId ? { ...todo, text: editText.trim() } : todo
      )
    );
    setEditingId(null);
    setEditText("");
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-white dark:bg-slate-950 p-8 transition-colors duration-300"
    >
      <div className="max-w-2xl mx-auto relative">
        <motion.button
          onClick={toggleDarkMode}
          className="absolute top-0 p-2 rounded-lg bg-slate-200 dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 text-slate-800 dark:text-slate-200"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle dark mode"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isDark ? "dark" : "light"}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {isDark ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.button>

        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl font-bold text-slate-900 dark:text-white mb-8 text-center transition-colors duration-300"
        >
          Todo App
        </motion.h1>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 mb-8 transition-colors duration-300"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              placeholder="Add a new todo..."
              className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4153] transition-all bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 placeholder-slate-500"
            />
            <motion.button
              onClick={addTodo}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#ff4153] text-white px-4 py-2 rounded-lg hover:bg-[#ff2c40] transition-colors duration-200 flex items-center gap-2"
            >
              <Plus size={20} /> Add
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden transition-colors duration-300"
        >
          <FilterTabs filter={filter} onChange={setFilter} />

          <LayoutGroup id="todos">
            <motion.div
              layout
              className="divide-y divide-slate-200 dark:divide-slate-800"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {filteredTodos.map((todo) => (
                  <motion.div
                    layout
                    key={todo.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{
                      opacity: 0,
                      x: -300,
                      transition: { duration: 0.2 },
                    }}
                    transition={{
                      layout: { type: "spring", bounce: 0.1, duration: 0.3 },
                    }}
                    className="p-4 flex items-center gap-4 group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200"
                  >
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => toggleTodo(todo.id)}
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                        todo.completed
                          ? "border-[#ff4153] bg-[#ff4153]"
                          : "border-slate-400 dark:border-slate-600"
                      )}
                    >
                      <AnimatePresence>
                        {todo.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check size={14} className="text-white" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>

                    {editingId === todo.id ? (
                      <motion.input
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                        onBlur={saveEdit}
                        autoFocus
                        className="flex-1 px-2 py-1 border border-slate-300 dark:border-slate-700 rounded focus:outline-none focus:ring-2 focus:ring-[#ff4153] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200"
                      />
                    ) : (
                      <motion.span
                        layout
                        className={cn(
                          "flex-1 text-slate-900 dark:text-slate-200",
                          todo.completed &&
                            "text-slate-400 dark:text-slate-500 line-through"
                        )}
                      >
                        {todo.text}
                      </motion.span>
                    )}

                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => startEditing(todo)}
                        className="text-slate-400 hover:text-[#ff4153] transition-colors"
                      >
                        <Edit2 size={18} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => deleteTodo(todo.id)}
                        className="text-slate-400 hover:text-[#ff4153] transition-colors"
                      >
                        <Trash2 size={18} />
                      </motion.button>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredTodos.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  className="p-8 text-center text-slate-500"
                >
                  No todos found
                </motion.div>
              )}
            </motion.div>
          </LayoutGroup>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default App;
