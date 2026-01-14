import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Logo from "@/components/Logo";
import ParticleBackground from "@/components/ParticleBackground";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ArrowLeft,
  UserPlus,
  Users,
  ArrowRight,
  Loader2,
  Phone,
  Mail,
  User,
  GraduationCap,
  Trash2,
  FileSpreadsheet,
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CameraCapture from "@/components/CameraCapture";
import ExcelUploadModal, { ParsedStudent } from "@/components/ExcelUploadModal";

interface Student {
  id: string;
  student_id: string;
  name: string;
  email: string;
  phone: string | null;
  class: string;
  section: string;
  age_group: string | null;
  photo_url: string | null;
}

const generateStudentId = (classLevel: string, section: string, index: number): string => {
  const prefix = "K";
  const paddedIndex = String(index).padStart(3, "0");
  return `${prefix}_${classLevel}_${section}${paddedIndex}`;
};

const StudentInfo = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"add" | "view">("view");
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [studentPhoto, setStudentPhoto] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    class: "",
    section: "",
  });

  // Fetch students from database
  const fetchStudents = async () => {
    setIsRefreshing(true);
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error("Fetch error:", error);
      toast.error("Failed to load students");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const uploadPhoto = async (photoData: string, studentId: string): Promise<string | null> => {
    try {
      // Convert base64 to blob
      const res = await fetch(photoData);
      const blob = await res.blob();
      
      const fileName = `${studentId}_${Date.now()}.jpg`;
      
      const { error } = await supabase.storage
        .from("student-photos")
        .upload(fileName, blob, { contentType: "image/jpeg" });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("student-photos")
        .getPublicUrl(fileName);

      return urlData.publicUrl;
    } catch (error) {
      console.error("Photo upload error:", error);
      return null;
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.name || !formData.email || !formData.class || !formData.section) {
      toast.error("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const studentId = generateStudentId(formData.class, formData.section, students.length + 1);
      
      let photoUrl: string | null = null;
      if (studentPhoto) {
        photoUrl = await uploadPhoto(studentPhoto, studentId);
      }

      const { error } = await supabase.from("students").insert({
        student_id: studentId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        class: formData.class,
        section: formData.section,
        photo_url: photoUrl,
      });

      if (error) throw error;

      toast.success(`Student added with ID: ${studentId}`);
      setFormData({ name: "", email: "", phone: "", class: "", section: "" });
      setStudentPhoto("");
      fetchStudents();
      setActiveTab("view");
    } catch (error: any) {
      console.error("Add error:", error);
      toast.error(error.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    try {
      const { error } = await supabase.from("students").delete().eq("id", id);
      if (error) throw error;
      
      setStudents(students.filter(s => s.id !== id));
      if (selectedStudent === id) setSelectedStudent("");
      toast.success("Student removed");
    } catch (error: any) {
      toast.error("Failed to delete student");
    }
  };

  const handleProceed = () => {
    if (!selectedStudent) {
      toast.error("Please select a student to proceed");
      return;
    }
    const student = students.find(s => s.id === selectedStudent);
    if (student) {
      sessionStorage.setItem("selectedStudents", JSON.stringify([student]));
      toast.success(`Proceeding with ${student.name}`);
      navigate("/career-visualization");
    }
  };

  const handleBulkImport = (parsedStudents: ParsedStudent[]) => {
    toast.success(`${parsedStudents.length} students parsed! Review and save.`);
    navigate("/bulk-upload-preview", { state: { students: parsedStudents } });
  };

  return (
    <div className="min-h-screen relative">
      <ParticleBackground />
      <div className="fixed inset-0 grid-pattern pointer-events-none z-0" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
        <Logo size="md" />
        <Link to="/auth">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft size={18} />
            Back to Login
          </Button>
        </Link>
      </nav>

      <main className="relative z-10 px-6 py-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
            <span className="neon-text">Student</span> Management
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Add students individually or bulk upload via Excel/CSV for Class 10C assessments
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-fadeIn" style={{ animationDelay: "0.05s" }}>
          <Button
            variant="neon"
            size="lg"
            onClick={() => setShowUploadModal(true)}
            className="gap-2"
          >
            <FileSpreadsheet size={20} />
            📥 Upload Excel/CSV
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setActiveTab("add")}
            className="gap-2 border-primary/30 hover:border-primary"
          >
            <UserPlus size={20} />
            ➕ Add Single Student
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 p-1 rounded-lg glass-card max-w-md mx-auto">
          <button
            onClick={() => setActiveTab("add")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "add"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <UserPlus size={18} />
            Add Student
          </button>
          <button
            onClick={() => setActiveTab("view")}
            className={`flex-1 py-3 px-4 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-2 ${
              activeTab === "view"
                ? "bg-primary text-primary-foreground shadow-lg"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users size={18} />
            View Students ({students.length})
          </button>
        </div>

        {/* Add Student Form */}
        {activeTab === "add" && (
          <div className="glass-card p-8 max-w-lg mx-auto animate-fadeIn">
            <h2 className="text-xl font-display font-semibold mb-6 flex items-center gap-2">
              <UserPlus size={24} className="text-primary" />
              Add New Student
            </h2>

            <form onSubmit={handleAddStudent} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="name"
                    placeholder="Enter student name"
                    className="pl-10 h-12 bg-muted/30 border-border/50"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="email"
                    type="email"
                    placeholder="student@example.com"
                    className="pl-10 h-12 bg-muted/30 border-border/50"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                  <Input
                    id="phone"
                    placeholder="+91 XXXXX XXXXX"
                    className="pl-10 h-12 bg-muted/30 border-border/50"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              {/* Camera Capture Section */}
              <div className="space-y-2">
                <Label>Student Photo</Label>
                <CameraCapture 
                  onCapture={setStudentPhoto} 
                  currentPhoto={studentPhoto}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Class *</Label>
                  <Select value={formData.class} onValueChange={(v) => setFormData({ ...formData, class: v })}>
                    <SelectTrigger className="h-12 bg-muted/30 border-border/50">
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {["6", "7", "8", "9", "10", "11", "12"].map((c) => (
                        <SelectItem key={c} value={c}>Class {c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Section *</Label>
                  <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                    <SelectTrigger className="h-12 bg-muted/30 border-border/50">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {["A", "B", "C", "D", "E", "K"].map((s) => (
                        <SelectItem key={s} value={s}>Section {s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                type="submit"
                variant="neon"
                size="lg"
                className="w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Adding...
                  </>
                ) : (
                  <>
                    <UserPlus size={20} />
                    Add Student
                  </>
                )}
              </Button>
            </form>
          </div>
        )}

        {/* View Students List */}
        {activeTab === "view" && (
          <div className="animate-fadeIn">
            {/* Refresh Button */}
            <div className="flex justify-end mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchStudents}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                Refresh
              </Button>
            </div>

            {students.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <GraduationCap size={48} className="mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Students Added</h3>
                <p className="text-muted-foreground mb-6">
                  Upload an Excel/CSV file or add students individually
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button variant="neon" onClick={() => setShowUploadModal(true)}>
                    <FileSpreadsheet size={18} className="mr-2" />
                    Upload Excel/CSV
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab("add")}>
                    <UserPlus size={18} className="mr-2" />
                    Add Single Student
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className={`glass-card p-4 cursor-pointer transition-all ${
                        selectedStudent === student.id
                          ? "border-primary neon-border"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedStudent(student.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {student.photo_url ? (
                            <img
                              src={student.photo_url}
                              alt={student.name}
                              className="w-12 h-12 rounded-xl object-cover border border-primary/30"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-center">
                              <User size={24} className="text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-muted-foreground">{student.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="badge-neon text-xs">{student.student_id}</span>
                            <p className="text-xs text-muted-foreground mt-1">
                              Class {student.class} - {student.section}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteStudent(student.id);
                            }}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="glass-card p-6 text-center">
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedStudent
                      ? `Selected: ${students.find(s => s.id === selectedStudent)?.name}`
                      : "Select a student to proceed"}
                  </p>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleProceed}
                    disabled={!selectedStudent}
                    className="gap-2"
                  >
                    Proceed to Career Visualizer
                    <ArrowRight size={20} />
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Excel Upload Modal */}
      <ExcelUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onImport={handleBulkImport}
      />
    </div>
  );
};

export default StudentInfo;
