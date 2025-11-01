import React, { useEffect, useState } from "react";
import { Button } from "../Components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
} from "../Components/ui/card";
import { Input } from "../Components/ui/input";
import { User, Mail, CheckCircle2, Trash2, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { api } from "../api/axios";

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState({ title: "", description: "" });
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully! 👋");
    navigate("/login");
  };

  // ✅ Fetch Notes + User Data
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      navigate("/signup");
      return;
    }

    setUser(JSON.parse(userData));

    const fetchNotes = async () => {
      try {
        const { data } = await api.get("/note", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNotes(data);
      } catch (error) {
        console.error(error);
        toast.error("❌ Failed to load notes — please check backend or token");
      }
    };
    fetchNotes();
  }, [navigate]);

  // ✅ Add Note
  const addNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!newNote.title.trim() || !newNote.description.trim()) {
      toast.error("⚠️ Title & Description required");
      return;
    }

    try {
      const { data } = await api.post("/note/create", newNote, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes([...notes, data]);
      setNewNote({ title: "", description: "" });
      toast.success("✅ Note added successfully!");
    } catch (error) {
      console.error(error);
      toast.error(
        "❌ Failed to add note — check backend route",
        error?.message
      );
    }
  };

  // ✅ Delete Note
  const deleteNote = async (id) => {
    const token = localStorage.getItem("token");
    try {
      await api.delete(`/note/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
      toast.success("🗑️ Note deleted");
    } catch (error) {
      console.error(error);
      toast.error("❌ Failed to delete note");
    }
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-gray-300 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-500 text-sm">Welcome back! {user?.name}</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleLogout}
            className="flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* ✅ Profile Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-100 flex items-center gap-2 text-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                User Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                <User className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-xs text-gray-500">Name</p>
                  <p className="text-gray-200 font-medium">{user?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700/30">
                <Mail className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-200 font-medium">{user?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ✅ Stats Card */}
          <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 shadow-xl hover:shadow-2xl transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-gray-100 flex items-center gap-2 text-xl">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                Task Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/30 text-center">
                  <p className="text-3xl font-bold text-blue-400">
                    {notes.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Total Notes</p>
                </div>
                <div className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/30 text-center">
                  <p className="text-3xl font-bold text-green-400">
                    {filteredNotes.length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Filtered</p>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-700/30">
                <p className="text-sm text-gray-300">
                  Keep up the great work! 🎉
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ✅ Notes Management */}
        <Card className="bg-gradient-to-br from-zinc-900 to-zinc-800 border border-zinc-700/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-gray-100 flex items-center gap-2 text-2xl">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              Manage Your Notes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Add Note */}
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
                placeholder="Enter note title..."
                className="bg-zinc-800/70 border-zinc-700 text-white"
              />
              <Input
                value={newNote.description}
                onChange={(e) =>
                  setNewNote({ ...newNote, description: e.target.value })
                }
                placeholder="Enter description..."
                className="bg-zinc-800/70 border-zinc-700 text-white"
              />
              <Button
                onClick={addNote}
                className="bg-gradient-to-r cursor-pointer from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Add
              </Button>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notes..."
                className="pl-10 bg-zinc-800/70 border-zinc-700 text-white"
              />
            </div>

            {/* Notes List */}
            <div className="space-y-3 mt-4 max-h-96 overflow-y-auto pr-2">
              {filteredNotes.length > 0 ? (
                filteredNotes.map((note) => (
                  <div
                    key={note._id}
                    className="p-4 bg-zinc-800/70 rounded-lg border border-zinc-700/50 flex justify-between items-start"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-gray-100">
                        {note.title}
                      </h3>
                      <p className="text-gray-400 text-sm mt-1">
                        {note.description}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="cursor-pointer"
                      onClick={() => deleteNote(note._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">
                  No notes found.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
